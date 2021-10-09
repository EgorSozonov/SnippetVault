namespace SnippetVault {
    using System;
    using System.Collections.Generic;

public class DBImportService<T> where T : class, new() {

        public IList<T> import(ExcelWorkbook wb, ExcelImportConfig config, Func<T, bool> validation,
            out string errMsg){
            var emptyResult = new List<T>();

            ExcelWorksheet sh = determineSheet(wb, config, out errMsg);
            if (errMsg != "") return emptyResult;

            determineTypeProperties(out ValueType[] propTypes,
               out Dictionary<string, Action<T, int>> settersInt,
               out Dictionary<string, Action<T, double>> settersDouble,
               out Dictionary<string, Action<T, decimal>> settersDecimal,
               out Dictionary<string, Action<T, string>> settersString,
               out Dictionary<string, Pair<int, string>> dictCols,
               out errMsg);
            if (errMsg != "") return emptyResult;

            var colNums = determineColumns(sh, dictCols, config, out string[] propNames, out errMsg);
            if (errMsg != "") return emptyResult;

            return importFromSheet(sh, colNums, propNames, propTypes, settersInt, settersDouble,
               settersDecimal, settersString, config, validation, true, out errMsg);
       }

      
       /// <summary>
       /// Импорт из Экселя с заданными номерами колонок, без заголовков
       /// </summary>
       public IList<T> importColumnNumbers(ExcelWorkbook wb, int[] colNums, string[] propNames,
                                           ExcelImportConfig config, Func<T, bool> validation,
                                           out string errMsg){
           var emptyResult = new List<T>();
          
           ExcelWorksheet sh = determineSheet(wb, config, out errMsg);
           if (errMsg != "") return emptyResult;

           determineTypeProperties(out ValueType[] propTypes,
               out Dictionary<string, Action<T, int>> settersInt,
               out Dictionary<string, Action<T, double>> settersDouble,
               out Dictionary<string, Action<T, decimal>> settersDecimal,
               out Dictionary<string, Action<T, string>> settersString,
               out Dictionary<string, Pair<int, string>> dictCols,
               out errMsg);
           if (errMsg != "") return emptyResult;
          
           errMsg = validateColNames(colNums, propNames, dictCols);
           if (errMsg != "") return emptyResult;

           return importFromSheet(sh, colNums, propNames, propTypes, settersInt, settersDouble,
               settersDecimal, settersString, config, validation, false, out errMsg);
       }

      
       private string validateColNames(int[] colNums, string[] propNames,
                                       Dictionary<string, Pair<int, string>> dictCols){
           if (colNums == null || colNums.Length == 0 || propNames == null) return "Input error: empty list of columns!";
           if (colNums.Length != propNames.Length) return "Input error: lengths of arrays don't match";
           for (int i = 0; i < colNums.Length; ++i) {
               if (colNums[i] < 0) return "Input error: negative column number";
               if (propNames[i] == null || propNames[i] == "") return "Input error: empty property name!";
               propNames[i] = propNames[i].Replace(" ", "").ToLower();
               ++colNums[i];
               if (!dictCols.ContainsKey(propNames[i])) return $"Input error: unknown column name {propNames[i]}";
           }
           return "";
       }
      
      
       private void determineTypeProperties(out ValueType[] propTypes,
               out Dictionary<string, Action<T, int>> settersInt,
               out Dictionary<string, Action<T, double>> settersDouble,
               out Dictionary<string, Action<T, decimal>> settersDecimal,
               out Dictionary<string, Action<T, string>> settersString,
               out Dictionary<string, Pair<int, string>> dictCols,
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
                   errMsg = "Unsupported column type, only Int, Double, Decimal and String columns are supported!";
                   return;
               }
               ++i;
           }
           errMsg = "";
       }

      
       private ExcelWorksheet determineSheet(ExcelWorkbook wb, ExcelImportConfig config, out string errMsg){
           var sheets = wb.Worksheets.ToArray();
           if (config.sheetChoice == SheetChoice.byName) {
               var sh = sheets.FirstOrDefault(x => x.Name == config.sheetName);
               errMsg = sh == null ? $"Sheet '{config.sheetName}' not found in workbook!" : "";
              
               return sh;
           } else {
               if (sheets.Length < config.sheetNumber) {
                   errMsg = $"Sheet #'{config.sheetNumber}' not found in workbook, because it contains only {sheets.Length} sheets!";
                   return null;
               }
               errMsg = "";
               return sheets[config.sheetNumber - 1]; // because zero-based
           }
       }


       private int[] determineColumns(ExcelWorksheet sh,
                                      Dictionary<string, Pair<int, string>> dictCols, ExcelImportConfig config,
                                      out string[] propNames, out string errMsg){
            propNames = new string[0];
            var empty2 = new int[0];

            int neededProps = dictCols.Count();
            int foundProps = 0;
            int j = config.colNumber;

            int numSkippedCols = 0;
          
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


        private IList<T> importFromSheet(ExcelWorksheet sh, int[] colNums, string[] propNames, ValueType[] propTypes,
                                        Dictionary<string, Action<T, int>> settersInt,
                                        Dictionary<string, Action<T, double>> settersDouble,
                                        Dictionary<string, Action<T, decimal>> settersDecimal,
                                        Dictionary<string, Action<T, string>> settersString,
                                        ExcelImportConfig config, Func<T, bool> validation, bool skipFirstRow,
                                        out string errMsg){
           var result = new List<T>();
           var emptyResult = new List<T>();
          
           int endRow = sh.Dimension.End.Row;
           int endCol = sh.Dimension.End.Column;
           if (config.rowNumber >= endRow || config.colNumber >= endCol) {
               errMsg = $"Cannot start from cell ({config.rowNumber}, {config.colNumber}) as it's beyond the end of the sheet";
               return result;
           }
           bool needToValidateRow = validation != null;
           int startRow = config.rowNumber + (skipFirstRow ? 1 : 0);

           for (int i = startRow; i <= endRow; ++i) {
               var newVal = new T();
               int foundProps = 0;
               for (int j = 0; j < colNums.Length; ++j) {
                   var cellValue = sh.Cells[i, colNums[j]].Value;
                   if (cellValue == null) break;

                   string propName = propNames[j];
                   if (propTypes[j] == ValueType.doubl) {
                       if (double.TryParse(cellValue.ToString(), out double vl)) {
                           settersDouble[propName](newVal, vl);
                           ++foundProps;
                       } else if (config.errorIgnoring == ImportErrorIgnoring.ignoreNone) {
                           errMsg = $"Error in cell ({i}, {j}): expected a double but found {cellValue}";
                           return emptyResult;
                       }
                   } if (propTypes[j] == ValueType.deciml) {
                       if (decimal.TryParse(cellValue.ToString(), out decimal vl)) {
                           settersDecimal[propName](newVal, vl);
                           ++foundProps;
                       } else if (config.errorIgnoring == ImportErrorIgnoring.ignoreNone) {
                           errMsg = $"Error in cell ({i}, {j}): expected a decimal but found {cellValue}";
                           return emptyResult;
                       }
                   } else if (propTypes[j] == ValueType.integr) {
                       if (double.TryParse(cellValue.ToString(), out double vl)) {
                           settersInt[propName](newVal, (int)vl);
                           ++foundProps;
                       } else if (config.errorIgnoring == ImportErrorIgnoring.ignoreNone) {
                           errMsg = $"Error in cell ({i}, {j}): expected an integer but found {cellValue}";
                           return emptyResult;
                       }
                   } else if (propTypes[j] == ValueType.strin) {
                       settersString[propName](newVal, cellValue.ToString());
                       ++foundProps;
                   }
               }

               if (foundProps == propNames.Length) {
                   if (needToValidateRow) {
                       var validationResult = validation(newVal);
                       if (!validationResult) {
                           errMsg = $"Validation failed for row {i}!";
                           return emptyResult;
                       }
                   }
                   result.Add(newVal);
               }
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





public class ExcelImportConfig {
    public ImportErrorIgnoring errorIgnoring { get; private set; } = ImportErrorIgnoring.ignoreNone;

    public SheetChoice sheetChoice { get; private set; } = SheetChoice.byNumber;
    public int sheetNumber { get; private set; } = 1;
    public string sheetName { get; private set; } = "";
    public int rowNumber { get; private set; } = 1;
    public int colNumber { get; private set; } = 1;
    public string dateFormat { get; private set; } = "yyyy-MM-dd";
    public string dateTimeFormat { get; private set; } = "yyyy-MM-dd HH:mm";


    public ExcelImportConfig ignoreErrors(ImportErrorIgnoring ignoring){
        this.errorIgnoring = ignoring;
        return this;
    }
      
    public ExcelImportConfig chooseSheetByName(string sheetName){
        if (sheetName != null && sheetName != "") {
            this.sheetChoice = SheetChoice.byName;
            this.sheetName = sheetName;
        }
        return this;
    }
      
      
    public ExcelImportConfig chooseSheetByNumber(int sheetNumber){
        if (sheetNumber > 0) {
            this.sheetChoice = SheetChoice.byNumber;
            this.sheetNumber = sheetNumber;
        }
        return this;
    }
      
      
       public ExcelImportConfig startAtCell(int rowN, int colN){
           if (rowN > 0 && colN > 0) {
               this.rowNumber = rowN;
               this.colNumber = colN;
           }
           return this;
       }
      
      
       public ExcelImportConfig withDateFormat(string dtFormat){
           if (dtFormat != "" && dtFormat != null) {
               this.dateFormat = dtFormat;
           }
           return this;
       }
      
      
        public ExcelImportConfig withDateTimeFormat(string dtTFormat){
            if (dtTFormat != "" && dtTFormat != null) {
                this.dateTimeFormat = dtTFormat;
            }
            return this;
        }
    }


    public enum ImportErrorIgnoring {
        ignoreNone,
        ignoreAll,
        ignoreOnlyIncompleteRows,
    }
  
  
    public enum SheetChoice {
        byNumber,
        byName,
    }    

}