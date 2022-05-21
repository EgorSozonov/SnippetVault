package tech.sozonov.SnippetVault.cmn.utils;
import java.lang.invoke.MethodHandles;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import io.r2dbc.spi.Row;
import lombok.AllArgsConstructor;
import lombok.val;
import tech.sozonov.SnippetVault.cmn.utils.Types.Pair;
import java.lang.invoke.VarHandle;
import java.text.CharacterIterator;
import java.text.StringCharacterIterator;

import static tech.sozonov.SnippetVault.cmn.utils.Strings.*;

public class Deserializer<T> {


private Class<T> qlass;
PropTarget[] columnTargets;
List<VarHandle> settersInt;
List<VarHandle> settersDouble;
//List<VarHandle> settersDecimal;
List<VarHandle> settersString;
List<VarHandle> settersBool;
List<VarHandle> settersTS;
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

public T unpackRow(Row dbRow) {
    if (!isOK) return null;
    try {
        val result = qlass.getDeclaredConstructor().newInstance();
        for (int j = 0; j < columnTargets.length; ++j) {
            var tgt = columnTargets[j];
            if (tgt.propType == ValueType.doubl) {
                settersDouble.get(tgt.indexSetter).set(result, (double)dbRow.get(j));
            } else if (tgt.propType == ValueType.integr) {
                settersInt.get(tgt.indexSetter).set(result, dbRow.get(j, Integer.class));
            } else if (tgt.propType == ValueType.strin) {
                settersString.get(tgt.indexSetter).set(result, dbRow.get(j, String.class));
            } else if (tgt.propType == ValueType.boole) {
                settersBool.get(tgt.indexSetter).set(result, dbRow.get(j, Boolean.class));
            } else if (tgt.propType == ValueType.timestampe) {
                settersTS.get(tgt.indexSetter).set(result, dbRow.get(j, LocalDateTime.class));
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
 * Parses column names from the SELECT query in order of appearance.
 * Uses the last occurrence of the SELECT ... FROM to extract the names of columns
 */
private String[] parseColumnNames(String sqlSelectQuery) {
    String inpNormalizedCase = sqlSelectQuery.toLowerCase();

    // Find last SELECT ... FROM
    val indsSelectFrom = parseSelectFrom(inpNormalizedCase);

    // Trim innards and split them by comma
    val substr = inpNormalizedCase.substring(indsSelectFrom.fst, indsSelectFrom.snd).trim();

    // Trim every element and start backwards
    val spl = substr.split(",");

    return Arrays.stream(spl).map(x -> parseColumnName(x)).toArray(String[]::new);
}

private String parseColumnName(String trimmedClause) {
    // Stop at start of string, dot or space

    // Replace quote chars if any
    return "";
}

private Pair<Integer, Integer> parseSelectFrom(String inpNormalizedCase) {
    val iter = new StringCharacterIterator(inpNormalizedCase, inpNormalizedCase.length());

    int levelParens = 0;
    char ch = iter.last();
    while (ch != CharacterIterator.DONE) {
        if (ch == ')') {
            ++levelParens;
        } else if (ch == '(') {
            --levelParens;
        } else if (ch == 'm' && levelParens == 0) {

        }

        ch = iter.previous();

    }
    return new Pair<Integer,Integer>(0, 0);
}

private void determineTypeProperties(String[] queryColumns) {
    val fieldsTypes = readDTOFields();

    int numProps = queryColumns.length;
    if (numProps != fieldsTypes.size()) {
        isOK = false;
        return;
    }

    columnTargets = new PropTarget[numProps];
    settersInt = new ArrayList<VarHandle>(numProps);
    settersString = new ArrayList<VarHandle>(numProps);
    settersDouble = new ArrayList<VarHandle>(numProps);
    //settersDecimal = new ArrayList<BiConsumer<T, decimal>>(numProps);
    settersBool = new ArrayList<VarHandle>(numProps);
    settersTS = new ArrayList<VarHandle>(numProps);

    try {
        val lookup = MethodHandles.lookup().in(qlass);
        for (int i = 0; i < numProps; ++i){
            String nameCol = queryColumns[i];
            if (!fieldsTypes.containsKey(nameCol)) {
                isOK = false;
                return;
            }

            val tp = fieldsTypes.get(nameCol);
            if (tp.snd == ValueType.integr) {
                settersInt.add(lookup.findVarHandle(qlass, tp.fst, int.class));
                columnTargets[i] = new PropTarget(settersInt.size() - 1, ValueType.integr);
            } else if (tp.snd == ValueType.doubl) {
                settersDouble.add(lookup.findVarHandle(qlass, tp.fst, double.class));
                columnTargets[i] = new PropTarget(settersDouble.size() - 1, ValueType.doubl);
            } /*else if (tp.snd == typeof(decimal)) {
                settersDecimal.Add((BiConsumer<T, decimal>) Delegate.CreateDelegate(typeof(BiConsumer<T, decimal>), null,
                        typeof(T).GetProperty(tp.fst).GetSetMethod()));
                columnTargets[i] = new PropTarget() { indexSetter = settersDecimal.size() - 1, propType = ValueType.deciml};
            } */else if (tp.snd == ValueType.strin) {
                settersString.add(lookup.findVarHandle(qlass, tp.fst, String.class));
                columnTargets[i] = new PropTarget(settersString.size() - 1, ValueType.strin);
            } else if (tp.snd == ValueType.boole) {
                settersBool.add(lookup.findVarHandle(qlass, tp.fst, Boolean.class));
                columnTargets[i] = new PropTarget(settersBool.size() - 1, ValueType.boole);
            } else if (tp.snd == ValueType.timestampe) {
                settersTS.add(lookup.findVarHandle(qlass, tp.fst, LocalDateTime.class));
                columnTargets[i] = new PropTarget(settersTS.size() - 1, ValueType.timestampe);
            }  else {
                isOK = false;
                return;
            }
        }
    }
    catch (Exception e) {
        isOK = false;
        return;
    }
}


private Map<String, Pair<String, ValueType>> readDTOFields() {
    val result = new HashMap<String, Pair<String, ValueType>>();
    val fields = qlass.getFields();

    for (val field : fields) {
        String normalizedName = field.getName().toLowerCase();
        // Because SQL is case-insensitive, names of the fields must be unique up to letter casing
        if (result.containsKey(normalizedName)) {
            isOK = false;
            return result;
        }

        val theType = field.getType();
        if (theType == Integer.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.integr));
        } else if (theType == Double.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.doubl));
        } else if (theType == String.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.strin));
        } else if (theType == Boolean.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.boole));
        } else if (theType == LocalDateTime.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.timestampe));
        }  else {
            isOK = false;
            return result;
        }
    }
    return result;
}

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
