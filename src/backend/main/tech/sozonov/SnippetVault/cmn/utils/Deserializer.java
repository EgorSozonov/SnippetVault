package tech.sozonov.SnippetVault.cmn.utils;
import java.lang.invoke.MethodHandles;
import java.time.LocalDateTime;
import java.util.ArrayList;
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


private final Class<T> qlass;
public final String sqlSelectQuery;
public PropTarget[] columnTargets;
List<VarHandle> settersInt;
List<VarHandle> settersLong;
List<VarHandle> settersDouble;
List<VarHandle> settersString;
List<VarHandle> settersBool;
List<VarHandle> settersTS;
List<VarHandle> settersBinary;
public boolean isOK;

public Deserializer(Class<T> _qlass, String _sqlSelectQuery) {
    qlass = _qlass;
    isOK = !(nullOrEmp(_sqlSelectQuery));
    sqlSelectQuery = _sqlSelectQuery;

    val queryColumns = parseColumnNames(sqlSelectQuery);
    if (queryColumns.size() == 0) {
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
            } else if (tgt.propType == ValueType.lon) {
                settersLong.get(tgt.indexSetter).set(result, dbRow.get(j, Long.class));
            } else if (tgt.propType == ValueType.strin) {
                settersString.get(tgt.indexSetter).set(result, dbRow.get(j, String.class));
            } else if (tgt.propType == ValueType.boole) {
                settersBool.get(tgt.indexSetter).set(result, (boolean)dbRow.get(j, Boolean.class));
            } else if (tgt.propType == ValueType.timestampe) {
                settersTS.get(tgt.indexSetter).set(result, dbRow.get(j, LocalDateTime.class));
            } else if (tgt.propType == ValueType.binar) {
                settersBinary.get(tgt.indexSetter).set(result, dbRow.get(j, byte[].class));
            }
            //else if (tgt.propType == ValueType.deciml) {
              //  settersDecimal[tgt.indexSetter](result, dbRow.GetDecimal(j));
            //}
        }
        return result;
    } catch (Exception ex) {
        System.out.println(ex.getMessage());
        return null;
    }
}

/**
 * Parses column names from the SELECT query in order of appearance.
 * Uses the last occurrence of the SELECT ... FROM to extract the names of columns
 */
public static List<String> parseColumnNames(final String sqlSelectQuery) {
    String inpNormalizedCase = sqlSelectQuery.toLowerCase();

    // Find last SELECT ... FROM
    val indsSelectFrom = parseSelectFrom(inpNormalizedCase);

    // Trim innards and split them by comma
    val selectFrom = inpNormalizedCase.substring(indsSelectFrom.fst, indsSelectFrom.snd).trim();

    List<String> result = new ArrayList<>();
    parseSelectFrom(selectFrom, result);

    return result;
}

/**
 * Walks over the SELECT ... FROM clause and splits it by top-level commas (i.e. the ones not inside parens)
 */
private static void parseSelectFrom(String selectFrom, List<String> result){
    val iter = new StringCharacterIterator(selectFrom);
    int prevInd = 0;

    val ctx = new ParseContext();
    while (prevInd < selectFrom.length()) {
        parseWalkUpToComma(iter, ctx);

        String clause = selectFrom.substring(prevInd, Math.min(selectFrom.length(), ctx.index + 1)).trim();
        String newColName = parseColumnName(clause);
        result.add(newColName);
        prevInd = ctx.index + 2;
    }
}

private static String parseColumnName(final String trimmedClause) {
    int indDot = trimmedClause.lastIndexOf('.');
    int indSpace = trimmedClause.lastIndexOf(' ');
    int indSepar = Math.max(indDot, indSpace);

    if (indSepar > -1) return trimmedClause.substring(indSepar + 1).replace("\"", "");

    return trimmedClause.replace("\"", "");
}

/**
 * Finds the locations of the top-level SELECT and FROM in a select query.
 * Correctly handles '--' comments and parentheses (i.e. chooses only the first
 * occurrence not inside parens).
 */
public static Pair<Integer, Integer> parseSelectFrom(String inpNormalizedCase) {
    val iter = new StringCharacterIterator(inpNormalizedCase);
    val err = new Pair<>(-1, -1);

    val ctx = new ParseContext();

    int foundSelect = -1;
    int foundFrom = -1;
    while (foundSelect < 0 || foundFrom < 0) {
        if (foundSelect < 0) {
            int indSelect = inpNormalizedCase.indexOf("select", ctx.index + 1);
            if (indSelect < 0) return err;
            parseWalkUpTo(iter, ctx, indSelect);
            if (!ctx.inComments && ctx.levelParens == 0) foundSelect = indSelect;
        } else {
            int indFrom = inpNormalizedCase.indexOf("from", ctx.index + 1);
            if (indFrom < 0) return err;
            parseWalkUpTo(iter, ctx, indFrom);
            if (!ctx.inComments && ctx.levelParens == 0) foundFrom = indFrom;
        }
    }

    return foundFrom > -1 ? new Pair<Integer,Integer>(foundSelect, foundFrom) : err;
}

/**
 * Walks a string up to the next top-level comma.
 */
private static void parseWalkUpToComma(CharacterIterator iter, ParseContext ctx) {
    char ch = iter.next();
    ++ctx.index;
    while (ch != CharacterIterator.DONE) {
        if (ch == ')') {
            --ctx.levelParens;
        } else if (ch == '(') {
            ++ctx.levelParens;
        } else if (ch == '-') {
            ch = iter.next();
            ++ctx.index;
            if (ch == CharacterIterator.DONE) return;
            if (ch == '-') ctx.inComments = true;
        } else if (ch == '\n' && ctx.inComments) {
            ctx.inComments = false;
        }
        if (ch == ',' && !ctx.inComments && ctx.levelParens == 0) {
            return;
        }
        ch = iter.next();
        ++ctx.index;
    }
}

/**
 * Walks a string up to a target index to keep track of whether it's top-level.
 */
private static void parseWalkUpTo(CharacterIterator iter, ParseContext ctx, int target) {
    char ch = iter.next();
    ++ctx.index;
    while (ctx.index < target) {
        if (ch == ')') {
            --ctx.levelParens;
        } else if (ch == '(') {
            ++ctx.levelParens;
        } else if (ch == '-') {
            ch = iter.next();
            ++ctx.index;
            if (ch == '-') ctx.inComments = true;
        } else if (ch == '\n' && ctx.inComments) {
            ctx.inComments = false;
        }
        ch = iter.next();
        ++ctx.index;
    }
}

private static class ParseContext {
    public int index = -1;
    public int levelParens = 0;
    public boolean inComments = false;
}

private void determineTypeProperties(List<String> queryColumns) {
    val fieldsTypes = readDTOFields();

    int numProps = queryColumns.size();
    if (numProps != fieldsTypes.size()) {
        isOK = false;
        return;
    }

    columnTargets = new PropTarget[numProps];
    settersInt = new ArrayList<VarHandle>(numProps);
    settersLong = new ArrayList<VarHandle>(numProps);
    settersString = new ArrayList<VarHandle>(numProps);
    settersDouble = new ArrayList<VarHandle>(numProps);
    //settersDecimal = new ArrayList<BiConsumer<T, decimal>>(numProps);
    settersBool = new ArrayList<VarHandle>(numProps);
    settersTS = new ArrayList<VarHandle>(numProps);

    try {
        val lookup = MethodHandles.lookup().in(qlass);
        for (int i = 0; i < numProps; ++i){
            String nameCol = queryColumns.get(i);

            if (!fieldsTypes.containsKey(nameCol)) {
                isOK = false;
                return;
            }

            val tp = fieldsTypes.get(nameCol);
            if (tp.snd == ValueType.integr) {
                settersInt.add(lookup.findVarHandle(qlass, tp.fst, int.class));
                columnTargets[i] = new PropTarget(settersInt.size() - 1, ValueType.integr);
            } else if (tp.snd == ValueType.lon) {
                settersLong.add(lookup.findVarHandle(qlass, tp.fst, long.class));
                columnTargets[i] = new PropTarget(settersLong.size() - 1, ValueType.lon);
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
                settersBool.add(lookup.findVarHandle(qlass, tp.fst, boolean.class));
                columnTargets[i] = new PropTarget(settersBool.size() - 1, ValueType.boole);
            } else if (tp.snd == ValueType.timestampe) {
                settersTS.add(lookup.findVarHandle(qlass, tp.fst, LocalDateTime.class));
                columnTargets[i] = new PropTarget(settersTS.size() - 1, ValueType.timestampe);
            } else if (tp.snd == ValueType.binar) {
                settersBinary.add(lookup.findVarHandle(qlass, tp.fst, byte[].class));
                columnTargets[i] = new PropTarget(settersBinary.size() - 1, ValueType.timestampe);
            } else {
                // Should never happen
                isOK = false;
                return;
            }
        }
    }
    catch (Exception e) {
        System.out.println(e.getMessage());
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
        if (theType == int.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.integr));
        } else if (theType == long.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.lon));
        } else if (theType == double.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.doubl));
        } else if (theType == String.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.strin));
        } else if (theType == boolean.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.boole));
        } else if (theType == LocalDateTime.class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.timestampe));
        } else if (theType == byte[].class) {
            result.put(normalizedName, new Pair<>(field.getName(), ValueType.binar));
        } else {
            isOK = false;
            return result;
        }
    }
    return result;
}

@AllArgsConstructor
public static class PropTarget {
    public int indexSetter;
    public ValueType propType;
}

public static enum ValueType {
    integr,
    lon,
    doubl,
    deciml,
    strin,
    boole,
    timestampe,
    binar,
}


}
