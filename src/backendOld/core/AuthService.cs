namespace SnippetVault {
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;

    public class AuthService : IAuthService {
    private readonly IStore st;

    public AuthService(IStore _st) {
        this.st = _st;
    }


    public async Task<ReqResult<SignInSuccessDTO>> userRegister(SignInDTO dto, IResponseCookies cookies) {
        if (dto.password == null || dto.password.Length < 8) {
            return new Err<SignInSuccessDTO>("Error! Password length must be at least 8 symbols");
        }

        string newSalt = "";
        var newHash = (dto.userName != AdminPasswordChecker.adminName)
            ? PasswordChecker.makeHash(dto.password, out newSalt) : AdminPasswordChecker.makeHash(dto.password, out newSalt);
        var newAccessToken = makeAccessToken();
        var user = new UserNewIntern() {
            userName = dto.userName, hash = newHash, salt = newSalt, accessToken = newAccessToken,
            dtExpiration = DateOnly.FromDateTime(DateTime.Today),
        };
        var newUserId = await st.userRegister(user);
        if (newUserId > 0) {
            var successList = new List<SignInSuccessDTO>() {new SignInSuccessDTO() {
                userId = newUserId}
                };
            // TODO Secure
            cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });

            return new Success<SignInSuccessDTO>(successList);
        } else {
            return new Err<SignInSuccessDTO>("Error registering user");
        }
    }

    public async Task<ReqResult<SignInSuccessDTO>> userAuthenticate(SignInDTO dto, IResponseCookies cookies) {
        var mbUserCreds = await st.userAuthentGet(dto.userName);
        if (mbUserCreds is Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
            var userAuthent = userAuthents.vals[0];
            userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
            userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);

            bool authentic = PasswordChecker.checkPassword(userAuthent, dto.password);
            if (!authentic) {
                cookies.Delete("accessToken");
                return new Err<SignInSuccessDTO>("Authentication error");
            }

            string accessToken = "";
            if (userAuthent.expiration.Date != DateTime.Today) {
                accessToken = makeAccessToken();
                await st.userUpdateExpiration(userAuthent.userId, accessToken, DateTime.Today);
            } else {
                accessToken = userAuthent.accessToken;
            }

            cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
            return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
                    new SignInSuccessDTO() { userId = userAuthent.userId, }
                }
            );
        } else {
            return new Err<SignInSuccessDTO>("Authentication error");
        }
    }

    public async Task<ReqResult<SignInSuccessDTO>> userAuthenticateAdmin(SignInAdminDTO dto, IResponseCookies cookies) {
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
            cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
            return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
                    new SignInSuccessDTO() { userId = userAuthent.userId, }
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

    public async Task<ReqResult<SignInSuccessDTO>> userUpdateAdminPw(ChangePwAdminDTO dto, IResponseCookies cookies) {
        var authentResult = await userAuthenticateAdmin(dto.signIn, cookies);

        if (authentResult is Success<SignInSuccessDTO> success) {
            var response = success.vals[0];
            string newSalt = "";
            var newHash = AdminPasswordChecker.makeHash(dto.newPw, out newSalt);
            var newAccessToken = makeAccessToken();
            var user = new UserNewIntern() {
                userName = dto.signIn.userName, salt = newSalt,
                hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
            };
            var updateCount = await st.userUpdate(user);

            cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
            return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
        } else {
            return new Err<SignInSuccessDTO>("Authentication error");
        }
    }

    public async Task<ReqResult<SignInSuccessDTO>> userUpdatePw(ChangePwDTO dto, IResponseCookies cookies) {
        var authentResult = await userAuthenticate(dto.signIn, cookies);

        if (authentResult is Success<SignInSuccessDTO> success) {
            var response = success.vals[0];
            string newSalt = "";
            var newHash = PasswordChecker.makeHash(dto.newPw, out newSalt);
            var newAccessToken = makeAccessToken();
            var user = new UserNewIntern() {
                userName = dto.signIn.userName, salt = newSalt,
                hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
            };
            var updateCount = await st.userUpdate(user);

            cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
            return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
        } else {
            return new Err<SignInSuccessDTO>("Authentication error");
        }
    }

    private string makeAccessToken() {
        var uuid1 = Guid.NewGuid().ToString();
        var uuid2 = Guid.NewGuid().ToString();
        return (uuid1 + uuid2);
    }

}

public interface IAuthService {
    Task<ReqResult<SignInSuccessDTO>> userRegister(SignInDTO dto, IResponseCookies cookies);
    Task<ReqResult<SignInSuccessDTO>> userAuthenticate(SignInDTO dto, IResponseCookies cookies);
    Task<ReqResult<SignInSuccessDTO>> userAuthenticateAdmin(SignInAdminDTO dto, IResponseCookies cookies);
    Task<bool> userAuthorize(int userId, string accessToken);
    Task<bool> userAuthorizeAdmin(string accessToken);
    Task<ReqResult<SignInSuccessDTO>> userUpdatePw(ChangePwDTO dto, IResponseCookies cookies);
    Task<ReqResult<SignInSuccessDTO>> userUpdateAdminPw(ChangePwAdminDTO dto, IResponseCookies cookies);
}

}
