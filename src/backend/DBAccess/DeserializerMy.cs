namespace SnippetVault {
using System;
using System.Collections.Generic;
using Npgsql;


public class DBDeserializer<T> where T : class, new() {
    PropTarget[] columnTargets;
    List<Action<T, int>> settersInt;
    List<Action<T, double>> settersDouble;
    List<Action<T, decimal>> settersDecimal;
    List<Action<T, string>> settersString;
    public bool isOK;

    private struct PropTarget {
        public ValueType propType;
        public int indexSetter;
    }


    public DBDeserializer(string[] queryColumns){
        this.isOK = true;
        determineTypeProperties(queryColumns, 
                                out columnTargets,
                                out settersInt,
                                out settersDouble,
                                out settersDecimal,
                                out settersString,
                                out string errMsg);
        if (errMsg != "") {
            isOK = false;
            return;
        }
    }


    private void determineTypeProperties(string[] queryColumns, out PropTarget[] propTargets,
            out List<Action<T, int>> settersInt,
            out List<Action<T, double>> settersDouble,
            out List<Action<T, decimal>> settersDecimal,
            out List<Action<T, string>> settersString,
            out string errMsg){
        int numProps = queryColumns.Length;
        var properties = typeof(T).GetProperties();
        propTargets = new PropTarget[numProps];
       
        settersInt = new List<Action<T, int>>(numProps);        
        settersString = new List<Action<T, string>>(numProps);
        settersDouble = new List<Action<T, double>>(numProps);
        settersDecimal = new List<Action<T, decimal>>(numProps);
      
        var dictProps = new Dictionary<string, Pair<string, Type>>();
        foreach (var prop in properties) {
            string normalizedName = prop.Name.Replace(" ", "").ToLower();
            if (dictProps.ContainsKey(normalizedName)) {
                errMsg = $"Target type must contain only case-insensitively unique field names. Name {normalizedName} is duplicate.";
                return;
            }
            dictProps.Add(normalizedName, new Pair<string, Type>(prop.Name, prop.PropertyType));
        }
      
        for (int i = 0; i < numProps; ++i){
            string nameCol = queryColumns[i].Replace(" ", "").ToLower();
            if (!dictProps.TryGetValue(nameCol, out Pair<string, Type> tp)) {
                errMsg = $"Column ${nameCol} not found among the properties of ${typeof(T)}";
            }
            if (tp.snd == typeof(int)) {                
                settersInt.Add((Action<T, int>) Delegate.CreateDelegate(typeof(Action<T, int>), null,
                               typeof(T).GetProperty(tp.fst).GetSetMethod()));
                propTargets[i] = new PropTarget() { indexSetter = settersInt.Count - 1, propType = ValueType.integr};
            } else if (tp.snd == typeof(double)) {
                settersDouble.Add((Action<T, double>) Delegate.CreateDelegate(typeof(Action<T, double>), null,
                       typeof(T).GetProperty(tp.fst).GetSetMethod()));
                propTargets[i] = new PropTarget() { indexSetter = settersDouble.Count - 1, propType = ValueType.doubl};    
            } else if (tp.snd == typeof(decimal)) {                
                settersDecimal.Add((Action<T, decimal>) Delegate.CreateDelegate(typeof(Action<T, decimal>), null,
                       typeof(T).GetProperty(tp.fst).GetSetMethod()));
                propTargets[i] = new PropTarget() { indexSetter = settersDecimal.Count - 1, propType = ValueType.deciml};
            } else if (tp.snd == typeof(string)) {
                settersString.Add((Action<T, string>) Delegate.CreateDelegate(typeof(Action<T, string>), null,
                                  typeof(T).GetProperty(tp.fst).GetSetMethod()));
                propTargets[i] = new PropTarget() { indexSetter = settersString.Count - 1, propType = ValueType.strin};
            } else {
                errMsg = $"Unsupported column type ${tp.snd}; only Int, Double, Decimal and String columns are supported!";
                return;
            }
        }
       errMsg = "";
    }


    public List<T> readResults(NpgsqlDataReader reader, out string errMsg) {
        var result = new List<T>(10);
        while (reader.Read()) {
            var newVal = new T();
            for (int j = 0; j < columnTargets.Length; ++j) {
                var tgt = columnTargets[j];
                if (tgt.propType == ValueType.doubl) {                    
                    settersDouble[tgt.indexSetter](newVal, reader.GetDouble(j)); 
                } else if (tgt.propType == ValueType.deciml) {
                    settersDecimal[tgt.indexSetter](newVal, reader.GetDecimal(j));       
                } else if (tgt.propType == ValueType.integr) {                    
                    settersInt[tgt.indexSetter](newVal, reader.IsDBNull(j) ? 0 : reader.GetInt32(j));                      
                } else if (tgt.propType == ValueType.strin) {
                    settersString[tgt.indexSetter](newVal, reader.IsDBNull(j) ? "" : reader.GetString(j));
                }
            }
            result.Add(newVal);
        }
        errMsg = "";
        return result;
    }

    public enum ValueType {
        integr,
        doubl,
        deciml,
        strin,
        // TODO add dates, datetimes and booleans
    }
}

}