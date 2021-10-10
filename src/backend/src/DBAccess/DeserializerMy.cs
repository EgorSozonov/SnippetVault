namespace SnippetVault {
using System;
using System.Collections.Generic;
using Npgsql;


public class DBDeserializer<T> where T : class, new() {
    PropTarget[] columnTargets;
    Action<T, int>[] settersInt;
    Action<T, double>[] settersDouble;
    Action<T, decimal>[] settersDecimal;
    Action<T, string>[] settersString;
    public bool isOK;

    private struct PropTarget {
        public ValueType propType;
        public int indexSetter;
    }

    public DBDeserializer(string[] queryColumns){
        this.isOK = true;
        determineTypeProperties(out columnTargets,
           out settersInt,
           out settersDouble,
           out settersDecimal,
           out settersString,
           out string errMsg);
        if (errMsg != "") {
            isOK = false;
            return;
        }

        var colNums = determineColumns(queryColumns, queryColumns, dictProperties, out errMsg);
        if (errMsg != "") {
            isOK = false;
            return;
        }

    }

    public List<T> readResults(Dictionary<string, Pair<int, string>> dictCols, NpgsqlDataReader reader, out string errMsg) {
        var result = new List<T>(10);
        while (reader.Read()) {
            var newVal = new T();
            foreach (var pair in dictCols.Values) {
                int j = pair.fst;
                string propName = pair.snd;
                if (propTypes[j] == ValueType.doubl) {                    
                    settersDouble[propName](newVal, reader.GetDouble(j)); 
                } if (propTypes[j] == ValueType.deciml) {
                    settersDecimal[propName](newVal, reader.GetDecimal(j));                        
                } else if (propTypes[j] == ValueType.integr) {                    
                    settersInt[propName](newVal, reader.GetInt32(j));                        
                } else if (propTypes[j] == ValueType.strin) {
                    settersString[propName](newVal, reader.GetString(j));
                }                 
            }
            result.Add(newVal);
        }
        errMsg = "";
        return result;
    }

      
    private void determineTypeProperties(out PropTarget[] columnTargets,
            out Action<T, int>[] settersInt,
            out Action<T, double>[] settersDouble,
            out Action<T, decimal>[] settersDecimal,
            out Action<T, string>[] settersString,
            out string errMsg){
        var properties = typeof(T).GetProperties();
        propTypes = new ValueType[properties.Length];
        int i = 0;
      
        settersInt = new Dictionary<string, Action<T, int>>();
        settersString = new Dictionary<string, Action<T, string>>();
        settersDouble = new Dictionary<string, Action<T, double>>();
        settersDecimal = new Dictionary<string, Action<T, decimal>>();
      
        dictCols = new Dictionary<string, Pair<int, string>>();
        foreach (var prop in properties) {
            string normalizedName = prop.Name.Replace(" ", "").ToLower();
            if (dictCols.ContainsKey(normalizedName)) {
                errMsg = $"Target type must contain only case-insensitively unique field names. Name {normalizedName} is duplicate.";
                return;
            }
            dictCols.Add(normalizedName, new Pair<int, string>(-1, prop.Name));
        }
      
        foreach (var prop in properties){
            if (prop.PropertyType == typeof(int)) {
                propTypes[i] = ValueType.integr;
                settersInt.Add(prop.Name.Replace(" ", "").ToLower(),
                               (Action<T, int>) Delegate.CreateDelegate(typeof(Action<T, int>), null,
                               typeof(T).GetProperty(prop.Name).GetSetMethod()));
            } else if (prop.PropertyType == typeof(double)) {
                propTypes[i] = ValueType.doubl;
                settersDouble.Add(prop.Name.Replace(" ", "").ToLower(),
                   (Action<T, double>) Delegate.CreateDelegate(typeof(Action<T, double>), null,
                       typeof(T).GetProperty(prop.Name).GetSetMethod()));
            } else if (prop.PropertyType == typeof(decimal)) {
                propTypes[i] = ValueType.deciml;
                settersDecimal.Add(prop.Name.Replace(" ", "").ToLower(),
                   (Action<T, decimal>) Delegate.CreateDelegate(typeof(Action<T, decimal>), null,
                       typeof(T).GetProperty(prop.Name).GetSetMethod()));
            } else if (prop.PropertyType == typeof(string)) {
                propTypes[i] = ValueType.strin;
                settersString.Add(prop.Name.Replace(" ", "").ToLower(),
                                 (Action<T, string>) Delegate.CreateDelegate(typeof(Action<T, string>), null,
                                 typeof(T).GetProperty(prop.Name).GetSetMethod()));
            } else {
                errMsg = "Unsupported column type; only Int, Double, Decimal and String columns are supported!";
                return;
            }
            ++i;
        }
       errMsg = "";
    }

      


    private int[] determineColumns(string[] columns, Dictionary<string, Pair<int, string>> dictProperties, 
                                  out string errMsg){
        propNames = new string[0];
        var empty2 = new int[0];

        int neededProps = dictCols.Count;
        int foundProps = 0;

        while (foundProps < neededProps) {
            var cellValue = sh.Cells[config.rowNumber, j].Value;
            if (cellValue != null) {
                string nameCol = cellValue.ToString().Replace(" ", "").ToLower();
                if (dictCols.TryGetValue(nameCol, out var tp)) {
                    if (tp.fst > -1) {
                        errMsg = $"Ambiguous column {nameCol} in input!";
                        return empty2;   
                    } else {
                        dictCols[nameCol].fst = j;
                        ++foundProps;
                        numSkippedCols = 0;
                    }
                }
            } else {
                ++numSkippedCols;
                if (numSkippedCols == 100) break;
            }
            ++j;
        }

        if (foundProps < neededProps) {
            string nameNotFound = dictCols.First(x => x.Value.fst < 0).Value.snd;
            errMsg = $"Error, column {nameNotFound} not found!";
            return empty2;
        }

       var result = new int[neededProps];
       propNames = new string[neededProps];

       int i = 0;
       foreach (var k in dictCols.Keys) {
            result[i] = dictCols[k].fst;
            propNames[i] = dictCols[k].snd;
            ++i;
       }
       errMsg = "";
       return result;
   }



    private class Pair<T, U> {
        public T fst { get; set; }
        public U snd { get; set; }


        public Pair(T _fst, U _snd){
            fst = _fst;
            snd = _snd;
        }
    }


    private enum ValueType {
        integr,
        doubl,
        deciml,
        strin,
        // TODO add dates, datetimes and booleans
    }
}





}