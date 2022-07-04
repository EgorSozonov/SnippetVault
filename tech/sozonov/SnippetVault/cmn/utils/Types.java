package sozonov.SnippetVault.cmn.utils;
import java.util.List;

import lombok.AllArgsConstructor;


public class Types {

public static class Pair<T, U> {
    public T fst;
    public U snd;


    public Pair(T _fst, U _snd){
        fst = _fst;
        snd = _snd;
    }
}

public static class ReqResult<T> {

}

public static final class Success<T> extends ReqResult<T> {
    public List<T> vals;

    public Success(List<T> _vals) {
        this.vals = _vals;
    }
}

public static final class Err<T> extends ReqResult<T> {
    public String err;

    public Err(String _err) {
        this.err = _err;
    }
}

@AllArgsConstructor
public static final class SelectChoice {
    public int id;
    public String name;
}

public static class CreateUpdate {
    public int existingId = -1;
    public boolean isDeleted;
}

}
