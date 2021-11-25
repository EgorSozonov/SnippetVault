namespace SnippetVault {
public class Pair<T, U> {
    public T fst { get; set; }
    public U snd { get; set; }


    public Pair(T _fst, U _snd){
        fst = _fst;
        snd = _snd;
    }
}    

}