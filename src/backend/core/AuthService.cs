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
        var uuid1 = Guid.NewGuid().ToString();
        var uuid2 = Guid.NewGuid().ToString();
        var newAccessToken = uuid1 + uuid2;
        var newUserId = await st.userRegister(userName, newHash, newSalt, newAccessToken, System.DateTime.Today);
        if (newUserId > 0) {
            var successList = new List<SignInDTO>() {new SignInDTO() {accessToken = newAccessToken, userId = newUserId}};
            return new Success<SignInDTO>(successList);
        } else {
            return new Err<SignInDTO>("Error registering user");
        }        
    }

    public async Task<ReqResult<SignInDTO>> userAuthenticate(string userName, string password) {
        var mbUserCreds = await st.userCredsGet(userName);
        if (mbUserCreds is Success<UserCredsDTO> userCreds && userCreds.vals.Count == 1) {
            var userCred = userCreds.vals[0];
            userCred.hash = EncodingUtils.convertToBcrypt(userCred.hash);
            userCred.salt = EncodingUtils.convertToBcrypt(userCred.salt);
            
            bool authentic = PasswordChecker.checkPassword(userCred, password);
            if (!authentic) return new Err<SignInDTO>("Authentication error");
            return new Success<SignInDTO>(new List<SignInDTO>() {
                    new SignInDTO() { accessToken = userCred.accessToken, userId = userCred.userId}
                }
            );
        } else {
            return new Err<SignInDTO>("Authentication error");
        }
    }

    public async Task<bool> userAuthorize(int userId, string accessToken) {
        var mbUserCreds = await st.userCredsGet(userName);
        if (mbUserCreds is Success<UserCredsDTO> userCreds && userCreds.vals.Count == 1) {
            var userCred = userCreds.vals[0];
            userCred.hash = EncodingUtils.convertToBcrypt(userCred.hash);
            userCred.salt = EncodingUtils.convertToBcrypt(userCred.salt);
            
            bool authentic = PasswordChecker.checkPassword(userCred, password);
            if (!authentic) return new Err<SignInDTO>("Authentication error");
            return new Success<SignInDTO>(new List<SignInDTO>() {
                    new SignInDTO() { accessToken = userCred.accessToken, userId = userCred.userId}
                }
            );
        } else {
            return new Err<SignInDTO>("Authentication error");
        }        
    }

}

public interface IAuthService {    
    Task<ReqResult<SignInDTO>> userRegister(string userName, string password);
    Task<ReqResult<SignInDTO>> userAuthenticate(string userName, string password);
    Task<bool> userAuthorize(int userId, string accessToken);
}

}