namespace SnippetVault {
using System.Collections.Generic;


public class Pair<T, U> {
    public T fst { get; set; }
    public U snd { get; set; }


    public Pair(T _fst, U _snd){
        fst = _fst;
        snd = _snd;
    }    
}

public class ReqResult<T> {
}

public sealed class Success<T> : ReqResult<T> {
    public List<T> vals;

    public Success(List<T> _vals) {
        this.vals = _vals;
    }
}

public sealed class Err<T> : ReqResult<T> {
    public string err;

    public Err(string _err) {
        this.err = _err;
    }
}

}