package tech.sozonov.sv


object SnippetVault {

def main(args: Array[String]): Unit =
    val arr0 = Array("a", "bbb", "cc", "dddd", "ff")
    val arr = arr0.sortWith((x, y) => x.length < y.length)

    print("[")
    print(arr(0))
    for (i <- 1 to arr.length - 1) 
        print(s", ${arr(i)}")
    
    println("]")
    println("hw")

    for (str, i <- arr0) 
        print(s"i $str")
        
    println("")
    ()


}