namespace SnippetVault {
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;


public class AuthService : IAuthService {
    private readonly IStore st;

    public AuthService(IStore _st) {
        this.st = _st;
    }


    public async Task<ReqResult<SignInSuccessDTO>> userRegister(SignInDTO dto) {
        if (dto.password == null || dto.password.Length < 8) {
            return new Err<SignInSuccessDTO>("Error! Password length must be at least 8 symbols");
        }

        string newSalt = "";
        var newHash = (dto.userName != AdminPasswordChecker.adminName) 
            ? PasswordChecker.makeHash(dto.password, out newSalt) : AdminPasswordChecker.makeHash(dto.password, out newSalt);
        var newAccessToken = makeAccessToken();
        var newUserId = await st.userRegister(dto.userName, newHash, newSalt, newAccessToken, System.DateTime.Today);
        if (newUserId > 0) {
            var successList = new List<SignInSuccessDTO>() {new SignInSuccessDTO() {
                accessToken = newAccessToken, userId = newUserId}
                };
            return new Success<SignInSuccessDTO>(successList);
        } else {
            return new Err<SignInSuccessDTO>("Error registering user");
        }        
    }

    public async Task<ReqResult<SignInSuccessDTO>> userAuthenticate(SignInDTO dto) {
        var mbUserCreds = await st.userAuthentGet(dto.userName);
        if (mbUserCreds is Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
            var userAuthent = userAuthents.vals[0];
            userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
            userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);
            
            bool authentic = PasswordChecker.checkPassword(userAuthent, dto.password);
            if (!authentic) return new Err<SignInSuccessDTO>("Authentication error");

            string accessToken = "";
            if (userAuthent.expiration.Date != DateTime.Today) {
                accessToken = makeAccessToken();
                await st.userUpdateExpiration(userAuthent.userId, accessToken, DateTime.Today);                
            } else {
                accessToken = userAuthent.accessToken;
            }

            return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
                    new SignInSuccessDTO() { accessToken = accessToken, userId = userAuthent.userId, }
                }
            );
        } else {
            return new Err<SignInSuccessDTO>("Authentication error");
        }
    }

    public async Task<ReqResult<SignInSuccessDTO>> userAuthenticateAdmin(SignInAdminDTO dto) {
        var err = new Err<SignInSuccessDTO>("Authentication error");
        if (dto.userName != AdminPasswordChecker.adminName) return err;
        var mbUserCreds = await st.userAuthentGet(dto.userName);

        if (mbUserCreds is Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {            
            var userAuthent = userAuthents.vals[0];
            userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
            userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);
            
            bool authentic = AdminPasswordChecker.checkAdminPassword(userAuthent, dto);
            if (!authentic) return err;

            string accessToken = "";
            if (userAuthent.expiration.Date != DateTime.Today) {
                accessToken = makeAccessToken();
                await st.userUpdateExpiration(userAuthent.userId, accessToken, DateTime.Today);                
            } else {
                accessToken = userAuthent.accessToken;
            }

            return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
                    new SignInSuccessDTO() { accessToken = accessToken, userId = userAuthent.userId, }
                }
            );
        } else {
            return err;
        }
    }

    public async Task<bool> userAuthorize(int userId, string accessToken) {
        var mbUserAuthor = await st.userAuthorizGet(userId);
        if (mbUserAuthor is Success<AuthorizeIntern> userAuthors && userAuthors.vals.Count == 1) {
            var userAuthor = userAuthors.vals[0];            
            bool authorized = userAuthor.expiration.Date == DateTime.Today && userAuthor.accessToken == accessToken;
            return authorized;
        } else {
            return false;
        }
    }

    public async Task<bool> userAuthorizeAdmin(string accessToken) {
        var mbUserAuthor = await st.userAdminAuthoriz();
        if (mbUserAuthor is Success<AuthorizeIntern> userAuthors && userAuthors.vals.Count == 1) {
            var userAuthor = userAuthors.vals[0];            
            bool authorized = userAuthor.expiration.Date == DateTime.Today && userAuthor.accessToken == accessToken;
            return authorized;
        } else {
            return false;
        }
    }

    public async Task<ReqResult<SignInSuccessDTO>> userUpdateAdminPw(UpdatePwAdminDTO dto) {
    }

    public async Task<ReqResult<SignInSuccessDTO>> userUpdatePw(UpdatePwDTO dto) {
    }

    private string makeAccessToken() {
        var uuid1 = Guid.NewGuid().ToString();
        var uuid2 = Guid.NewGuid().ToString();
        return (uuid1 + uuid2);
    }

}

public interface IAuthService {    
    Task<ReqResult<SignInSuccessDTO>> userRegister(SignInDTO dto);
    Task<ReqResult<SignInSuccessDTO>> userAuthenticate(SignInDTO dto);
    Task<ReqResult<SignInSuccessDTO>> userAuthenticateAdmin(SignInAdminDTO dto);
    Task<bool> userAuthorize(int userId, string accessToken);
    Task<bool> userAuthorizeAdmin(string accessToken);
    Task<ReqResult<SignInSuccessDTO>> userUpdatePw(UpdatePwDTO dto);
    Task<ReqResult<SignInSuccessDTO>> userUpdateAdminPw(UpdatePwAdminDTO dto);
}

}