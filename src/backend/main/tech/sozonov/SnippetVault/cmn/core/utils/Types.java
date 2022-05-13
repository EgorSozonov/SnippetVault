package tech.sozonov.SnippetVault.core.utils;
import java.util.List;


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

public static final class SelectChoice {
    public int id;
    public String name;
}

public static class CreateUpdate {
    public int existingId;
    public boolean isDeleted;
}

}
