namespace SnippetVault {
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;


public class AuthService : IAuthService {
    private readonly IStore st;

    public AuthService(IStore _st) {
        this.st = _st;
    }


    public async Task<ReqResult<SignInDTO>> userRegister(string userName, string password) {
        if (password == null || password.Length < 8) {
            return new Err<SignInDTO>("Error! Password length must be at least 8 symbols");
        }

        var newHash = PasswordChecker.makeHash(password, out string newSalt);        
        var newAccessToken = makeAccessToken();
        var newUserId = await st.userRegister(userName, newHash, newSalt, newAccessToken, System.DateTime.Today);
        if (newUserId > 0) {
            var successList = new List<SignInDTO>() {new SignInDTO() {accessToken = newAccessToken, userId = newUserId}};
            return new Success<SignInDTO>(successList);
        } else {
            return new Err<SignInDTO>("Error registering user");
        }        
    }

    public async Task<ReqResult<SignInDTO>> userAuthenticate(string userName, string password) {
        var mbUserCreds = await st.userAuthentGet(userName);
        if (mbUserCreds is Success<AuthenticateDTO> userAuthents && userAuthents.vals.Count == 1) {
            var userAuthent = userAuthents.vals[0];
            userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
            userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);
            
            bool authentic = PasswordChecker.checkPassword(userAuthent, password);
            if (!authentic) return new Err<SignInDTO>("Authentication error");

            string accessToken = "";
            if (userAuthent.expiration.Date != DateTime.Today) {
                accessToken = makeAccessToken();
                await st.userUpdateExpiration(userAuthent.userId, accessToken, DateTime.Today);                
            }
            

            return new Success<SignInDTO>(new List<SignInDTO>() {
                    new SignInDTO() { accessToken = accessToken, userId = userAuthent.userId, }
                }
            );
        } else {
            return new Err<SignInDTO>("Authentication error");
        }
    }

    public async Task<bool> userAuthorize(int userId, string accessToken) {
        var mbUserAuthor = await st.userAuthorGet(userId);
        if (mbUserAuthor is Success<AuthorizeDTO> userAuthors && userAuthors.vals.Count == 1) {
            var userAuthor = userAuthors.vals[0];            
            bool authorized = userAuthor.expiration.Date == DateTime.Today && userAuthor.accessToken == accessToken;
            return authorized;
        } else {
            return false;
        }
    }

    private string makeAccessToken() {
        var uuid1 = Guid.NewGuid().ToString();
        var uuid2 = Guid.NewGuid().ToString();
        return (uuid1 + uuid2);
    }

}

public interface IAuthService {    
    Task<ReqResult<SignInDTO>> userRegister(string userName, string password);
    Task<ReqResult<SignInDTO>> userAuthenticate(string userName, string password);
    Task<bool> userAuthorize(int userId, string accessToken);
}

}