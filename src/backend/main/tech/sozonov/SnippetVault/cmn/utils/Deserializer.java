package tech.sozonov.SnippetVault.cmn.utils;
import java.lang.invoke.MethodHandles;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import io.r2dbc.spi.Row;
import lombok.AllArgsConstructor;
import lombok.val;
import tech.sozonov.SnippetVault.cmn.utils.Types.Pair;
import static tech.sozonov.SnippetVault.cmn.utils.Strings.*;

public class Deserializer<T> {


private Class<T> qlass;
PropTarget[] columnTargets;
List<BiConsumer<T, Integer>> settersInt;
List<BiConsumer<T, Double>> settersDouble;
//List<BiConsumer<T, Decimal>> settersDecimal;
List<BiConsumer<T, String>> settersString;
List<BiConsumer<T, Boolean>> settersBool;
List<BiConsumer<T, LocalDateTime>> settersTS;
public boolean isOK;

public Deserializer(Class<T> _qlass, String sqlSelectQuery) {
    qlass = _qlass;
    isOK = true;
    if (nullOrEmp(sqlSelectQuery)) isOK = false;

    val queryColumns = parseColumnNames(sqlSelectQuery);
    if (queryColumns.length == 0) {
        isOK = false;
        return;
    }

    determineTypeProperties(queryColumns);

}
// private struct PropTarget {
//     public ValueType propType;
//     public int indexSetter;
// }



public T unpackRow(Row dbRow) {
    if (!isOK) return null;
    try {
        val result = qlass.getDeclaredConstructor().newInstance();
        for (int j = 0; j < columnTargets.length; ++j) {
            var tgt = columnTargets[j];
            if (tgt.propType == ValueType.doubl) {
                settersDouble.get(tgt.indexSetter).accept(result, (double)dbRow.get(j));
            } else if (tgt.propType == ValueType.integr) {
                settersInt.get(tgt.indexSetter).accept(result, dbRow.get(j, Integer.class));
            } else if (tgt.propType == ValueType.strin) {
                settersString.get(tgt.indexSetter).accept(result, dbRow.get(j, String.class));
            } else if (tgt.propType == ValueType.boole) {
                settersBool.get(tgt.indexSetter).accept(result, dbRow.get(j, Boolean.class));
            } else if (tgt.propType == ValueType.timestampe) {
                settersTS.get(tgt.indexSetter).accept(result, dbRow.get(j, LocalDateTime.class));
            }
            //else if (tgt.propType == ValueType.deciml) {
              //  settersDecimal[tgt.indexSetter](result, dbRow.GetDecimal(j));
            //}
        }
        return result;
    } catch (Exception ex) {
        return null;
    }


}

/**
 * Parses column names from the SELECT query in order of appearance
 */
private String[] parseColumnNames(String sqlSelectQuery) {
    return new String[] {};
}

private void determineTypeProperties(String[] queryColumns) {

    MethodHandles.Lookup publicLookup = MethodHandles.publicLookup();
    val fieldsTypes = readDTOFields();


    int numProps = queryColumns.length;
    if (numProps != fieldsTypes.size()) {
        isOK = false;
        return;
    }

    columnTargets = new PropTarget[numProps];
    settersInt = new ArrayList<BiConsumer<T, Integer>>(numProps);
    settersString = new ArrayList<BiConsumer<T, String>>(numProps);
    settersDouble = new ArrayList<BiConsumer<T, Double>>(numProps);
    //settersDecimal = new ArrayList<BiConsumer<T, decimal>>(numProps);
    settersBool = new ArrayList<BiConsumer<T, Boolean>>(numProps);
    settersTS = new ArrayList<BiConsumer<T, LocalDateTime>>(numProps);

// VarHandle PUBLIC_TEST_VARIABLE = MethodHandles
//   .lookup()
//   .in(VariableHandlesUnitTest.class)
//   .findVarHandle(VariableHandlesUnitTest.class, "publicTestVariable", int.class);

    for (int i = 0; i < numProps; ++i){
        String nameCol = queryColumns[i];
        if (!dictProps.containsKey(nameCol)) {
            isOK = false;
            return;
        }
        val tp = dictProps.get(nameCol);
        if (tp.snd == Integer.class) {
            settersInt.add((x, y) -> setters.get(tp.fst).invoke(x, y));
            columnTargets[i] = new PropTarget(settersInt.size() - 1, ValueType.integr);
        } else if (tp.snd == Double.class) {
            settersDouble.add((x, y) -> setters.get(tp.fst).invoke(x, y));
            columnTargets[i] = new PropTarget(settersDouble.size() - 1, ValueType.doubl);
        } /*else if (tp.snd == typeof(decimal)) {
            settersDecimal.Add((BiConsumer<T, decimal>) Delegate.CreateDelegate(typeof(BiConsumer<T, decimal>), null,
                    typeof(T).GetProperty(tp.fst).GetSetMethod()));
            columnTargets[i] = new PropTarget() { indexSetter = settersDecimal.size() - 1, propType = ValueType.deciml};
        } */else if (tp.snd == String.class) {
            settersString.add((x, y) -> setters.get(tp.fst).invoke(x, y));
            columnTargets[i] = new PropTarget(settersString.size() - 1, ValueType.strin);
        } else if (tp.snd == Boolean.class) {
            settersBool.add((x, y) -> setters.get(tp.fst).invoke(x, y));
            columnTargets[i] = new PropTarget(settersBool.size() - 1, ValueType.boole);
        } else if (tp.snd == LocalDateTime.class) {
            settersTS.add((x, y) -> setters.get(tp.fst).invoke(x, y));
            columnTargets[i] = new PropTarget(settersTS.size() - 1, ValueType.timestampe);
        }  else {
            isOK = false;
            return;
        }
    }


        // Method[] gettersAndSetters = object_a.getClass().getMethods();
        // for (int i = 0; i < gettersAndSetters.length; i++) {
        //     String methodName = gettersAndSetters[i].getName();
        //     try {
        //         if (methodName.startsWith("get")){
        //             this.getClass().getMethod(methodName.replaceFirst("get", "set") , gettersAndSetters[i].getReturnType() ).invoke(this, gettersAndSetters[i].invoke(object_a, null));
        //         }else if(methodName.startsWith("is") ){
        //             this.getClass().getMethod(methodName.replaceFirst("is", "set") ,  gettersAndSetters[i].getReturnType()  ).invoke(this, gettersAndSetters[i].invoke(object_a, null));
        //         }

        //     } catch (NoSuchMethodException e) {
        //         // TODO: handle exception
        //     } catch (IllegalArgumentException e) {
        //         // TODO: handle exception
        //     }
        // }
}


private Map<String, ValueType> readDTOFields() {
    val result = new HashMap<String, ValueType>();
    val fields = qlass.getFields();

    for (val field : fields) {
        String normalizedName = field.getName().toLowerCase();
        // Because SQL is case-insensitive, names of the fields must be unique up to letter casing
        if (dictProps.containsKey(normalizedName)) {
            isOK = false;
            return result;
        }

        val theType = field.getType();
        if (theType == Integer.class) {
            result.put(normalizedName, ValueType.integr);
        } else if (theType == Double.class) {
            result.put(normalizedName, ValueType.doubl);
        } else if (theType == String.class) {
            result.put(normalizedName, ValueType.strin);
        } else if (theType == Boolean.class) {
            result.put(normalizedName, ValueType.boole);
        } else if (theType == LocalDateTime.class) {
            result.put(normalizedName, ValueType.timestampe);
        }  else {
            isOK = false;
            return;
        }
    }
    return result;
}


// private void determineTypeProperties(String[] queryColumns, out PropTarget[] columnTargets,
//         out List<BiConsumer<T, int>> settersInt,
//         out List<BiConsumer<T, double>> settersDouble,
//         out List<BiConsumer<T, decimal>> settersDecimal,
//         out List<BiConsumer<T, String>> settersString,
//         out List<BiConsumer<T, bool>> settersBool,
//         out List<BiConsumer<T, DateTime>> settersTS,
//         out String errMsg){
//     int numProps = queryColumns.Length;
//     var properties = typeof(T).GetProperties();
//     columnTargets = new PropTarget[numProps];

//     settersInt = new List<BiConsumer<T, int>>(numProps);
//     settersString = new List<BiConsumer<T, String>>(numProps);
//     settersDouble = new List<BiConsumer<T, double>>(numProps);
//     settersDecimal = new List<BiConsumer<T, decimal>>(numProps);
//     settersBool = new List<BiConsumer<T, bool>>(numProps);
//     settersTS = new List<BiConsumer<T, DateTime>>(numProps);

//     var dictProps = new Dictionary<String, Pair<String, Type>>();
//     foreach (var prop in properties) {
//         String normalizedName = prop.Name.Replace(" ", "").ToLower();
//         if (dictProps.ContainsKey(normalizedName)) {
//             errMsg = $"Target type must contain only case-insensitively unique field names. Name {normalizedName} is duplicate.";
//             return;
//         }
//         dictProps.Add(normalizedName, new Pair<String, Type>(prop.Name, prop.PropertyType));
//     }

//     for (int i = 0; i < numProps; ++i){
//         String nameCol = queryColumns[i].Replace(" ", "").ToLower();
//         if (!dictProps.TryGetValue(nameCol, out Pair<String, Type> tp)) {
//             errMsg = $"Column ${nameCol} not found among the properties of ${typeof(T)}";
//         }
//         if (tp.snd == typeof(int)) {
//             settersInt.Add((BiConsumer<T, int>) Delegate.CreateDelegate(typeof(BiConsumer<T, int>), null,
//                             typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             columnTargets[i] = new PropTarget() { indexSetter = settersInt.size() - 1, propType = ValueType.integr};
//         } else if (tp.snd == typeof(double)) {
//             settersDouble.Add((BiConsumer<T, double>) Delegate.CreateDelegate(typeof(BiConsumer<T, double>), null,
//                     typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             columnTargets[i] = new PropTarget() { indexSetter = settersDouble.size() - 1, propType = ValueType.doubl};
//         } else if (tp.snd == typeof(decimal)) {
//             settersDecimal.Add((BiConsumer<T, decimal>) Delegate.CreateDelegate(typeof(BiConsumer<T, decimal>), null,
//                     typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             columnTargets[i] = new PropTarget() { indexSetter = settersDecimal.size() - 1, propType = ValueType.deciml};
//         } else if (tp.snd == typeof(String)) {
//             settersString.Add((BiConsumer<T, String>) Delegate.CreateDelegate(typeof(BiConsumer<T, String>), null,
//                                 typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             columnTargets[i] = new PropTarget() { indexSetter = settersString.size() - 1, propType = ValueType.strin};
//         } else if (tp.snd == typeof(bool)) {
//             settersBool.Add((BiConsumer<T, bool>) Delegate.CreateDelegate(typeof(BiConsumer<T, bool>), null,
//                                 typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             columnTargets[i] = new PropTarget() { indexSetter = settersBool.size() - 1, propType = ValueType.boole};
//         } else if (tp.snd == typeof(DateTime)) {
//             settersTS.Add((BiConsumer<T, DateTime>) Delegate.CreateDelegate(typeof(BiConsumer<T, DateTime>), null,
//                                 typeof(T).GetProperty(tp.fst).GetSetMethod()));
//             columnTargets[i] = new PropTarget() { indexSetter = settersTS.size() - 1, propType = ValueType.timestampe};
//         }  else {
//             errMsg = $"Unsupported column type ${tp.snd}; only Int, Double, Decimal, Timestamp and String columns are supported!";
//             return;
//         }
//     }
//     errMsg = "";
// }

@AllArgsConstructor
private static class PropTarget {
    public int indexSetter;
    public ValueType propType;
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
