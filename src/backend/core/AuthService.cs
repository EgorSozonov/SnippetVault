namespace SnippetVault {
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;


public class AuthService : IAuthService {
    private readonly IStore st;

    public AuthService(IStore _st) {
        this.st = _st;
    }

    public async Task<ReqResult<SignInDTO>> userSignIn(string userName, string password) {
        var mbUserCreds = await st.userCredsGet(userName);
        if (mbUserCreds is Success<UserCredsDTO> userCreds && userCreds.vals.Count > 0) {
            var userCred = userCreds.vals[0];
            
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

    public async Task<ReqResult<SignInDTO>> userRegister(string userName, string password) {
        // check if user exists and if the password is long enough
        if (password == null || password.Length < 8) {
            return new Err<SignInDTO>("Error! Password length must be at least 8 symbols");
        }

        // if everything's OK, insert a row with token and expiration
        var newHash = PasswordChecker.makeHash(password, out string newSalt);
        var uuid1 = Guid.NewGuid().ToString();
        var uuid2 = Guid.NewGuid().ToString();
        var newAccessToken = uuid1 + uuid2;
        var newUserId = await st.userRegister(userName, newHash, newSalt, newAccessToken, System.DateTime.Today);
        return newUserId > 0 ? new Success<SignInDTO>(new List<SignInDTO>() {new SignInDTO() {accessToken = newAccessToken, userId = newUserId}}) 
                             : new Err<SignInDTO>("Error registering user");
    }


}

public interface IAuthService {
    

    Task<ReqResult<SignInDTO>> userSignIn(string userName, string password);
    Task<ReqResult<SignInDTO>> userRegister(string userName, string password);

}

}