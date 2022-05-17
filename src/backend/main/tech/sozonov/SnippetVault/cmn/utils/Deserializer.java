package tech.sozonov.SnippetVault.cmn.utils;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiConsumer;
import tech.sozonov.SnippetVault.cmn.utils.Types.Pair;

public class Deserializer<T> {


PropTarget[] columnTargets;
List<BiConsumer<T, Integer>> settersInt;
List<BiConsumer<T, Double>> settersDouble;
//List<BiConsumer<T, Decimal>> settersDecimal;
List<BiConsumer<T, String>> settersString;
List<BiConsumer<T, Boolean>> settersBool;
List<BiConsumer<T, LocalDateTime>> settersTS;
public boolean isOK;

// private struct PropTarget {
//     public ValueType propType;
//     public int indexSetter;
// }



public Pair<T, String> unpackRow(Row dbRow) {


    var result = new T();
    for (int j = 0; j < columnTargets.length; ++j) {
        var tgt = columnTargets[j];
        if (tgt.propType == ValueType.doubl) {
            settersDouble.get(tgt.indexSetter).apply(result, dbRow.get(j, Double.class));
        } else if (tgt.propType == ValueType.integr) {
            settersInt.get(tgt.indexSetter).apply(result, dbRow.get(j, Integer.class));
        } else if (tgt.propType == ValueType.strin) {
            settersString.get(tgt.indexSetter).apply(result, dbRow.get(j, String.class));
        } else if (tgt.propType == ValueType.boole) {
            settersBool[tgt.indexSetter](result, dbRow.IsDBNull(j) ? false : dbRow.GetBoolean(j));
        } else if (tgt.propType == ValueType.timestampe) {
            settersTS[tgt.indexSetter](result, dbRow.IsDBNull(j) ? LocalDateTime.MIN : dbRow.GetDateTime(j));
        }
        //else if (tgt.propType == ValueType.deciml) {
          //  settersDecimal[tgt.indexSetter](result, dbRow.GetDecimal(j));
        //}
    }



    return new Pair(result, "");
}

// public DBDeserializer(string[] queryColumns){
//     this.isOK = true;
//     determineTypeProperties(queryColumns,
//                             out columnTargets,
//                             out settersInt,
//                             out settersDouble,
//                             out settersDecimal,
//                             out settersString,
//                             out settersBool,
//                             out settersTS,
//                             out string errMsg);
//     if (errMsg != "") {
//         isOK = false;
//         return;
//     }
// }


// private void determineTypeProperties(string[] queryColumns, out PropTarget[] propTargets,
//         out List<Action<T, int>> settersInt,
//         out List<Action<T, double>> settersDouble,
//         out List<Action<T, decimal>> settersDecimal,
//         out List<Action<T, string>> settersString,
//         out List<Action<T, bool>> settersBool,
//         out List<Action<T, DateTime>> settersTS,
//         out string errMsg){
//     int numProps = queryColumns.Length;
//     var properties = typeof(T).GetProperties();
//     propTargets = new PropTarget[numProps];

//     settersInt = new List<Action<T, int>>(numProps);
//     settersString = new List<Action<T, string>>(numProps);
//     settersDouble = new List<Action<T, double>>(numProps);
//     settersDecimal = new List<Action<T, decimal>>(numProps);
//     settersBool = new List<Action<T, bool>>(numProps);
//     settersTS = new List<Action<T, DateTime>>(numProps);

//     var dictProps = new Dictionary<string, Pair<string, Type>>();
//     foreach (var prop in properties) {
//         string normalizedName = prop.Name.Replace(" ", "").ToLower();
//         if (dictProps.ContainsKey(normalizedName)) {
//             errMsg = $"Target type must contain only case-insensitively unique field names. Name {normalizedName} is duplicate.";
//             return;
//         }
//         dictProps.Add(normalizedName, new Pair<string, Type>(prop.Name, prop.PropertyType));
//     }

//     for (int i = 0; i < numProps; ++i){
//         string nameCol = queryColumns[i].Replace(" ", "").ToLower();
//         if (!dictProps.TryGetValue(nameCol, out Pair<string, Type> tp)) {
//             errMsg = $"Column ${nameCol} not found among the properties of ${typeof(T)}";
//         }
//         if (tp.snd == typeof(int)) {
//             settersInt.Add((Action<T, int>) Delegate.CreateDelegate(typeof(Action<T, int>), null,
//                             typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             propTargets[i] = new PropTarget() { indexSetter = settersInt.Count - 1, propType = ValueType.integr};
//         } else if (tp.snd == typeof(double)) {
//             settersDouble.Add((Action<T, double>) Delegate.CreateDelegate(typeof(Action<T, double>), null,
//                     typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             propTargets[i] = new PropTarget() { indexSetter = settersDouble.Count - 1, propType = ValueType.doubl};
//         } else if (tp.snd == typeof(decimal)) {
//             settersDecimal.Add((Action<T, decimal>) Delegate.CreateDelegate(typeof(Action<T, decimal>), null,
//                     typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             propTargets[i] = new PropTarget() { indexSetter = settersDecimal.Count - 1, propType = ValueType.deciml};
//         } else if (tp.snd == typeof(string)) {
//             settersString.Add((Action<T, string>) Delegate.CreateDelegate(typeof(Action<T, string>), null,
//                                 typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             propTargets[i] = new PropTarget() { indexSetter = settersString.Count - 1, propType = ValueType.strin};
//         } else if (tp.snd == typeof(bool)) {
//             settersBool.Add((Action<T, bool>) Delegate.CreateDelegate(typeof(Action<T, bool>), null,
//                                 typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             propTargets[i] = new PropTarget() { indexSetter = settersBool.Count - 1, propType = ValueType.boole};
//         } else if (tp.snd == typeof(DateTime)) {
//             settersTS.Add((Action<T, DateTime>) Delegate.CreateDelegate(typeof(Action<T, DateTime>), null,
//                                 typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             propTargets[i] = new PropTarget() { indexSetter = settersTS.Count - 1, propType = ValueType.timestampe};
//         }  else {
//             errMsg = $"Unsupported column type ${tp.snd}; only Int, Double, Decimal, Timestamp and String columns are supported!";
//             return;
//         }
//     }
//     errMsg = "";
// }

private static class PropTarget {
    public ValueType propType;
    public int indexSetter;
}

public static enum ValueType {
    integr,
    doubl,
    deciml,
    strin,
    boole,
    timestampe,
}

}
