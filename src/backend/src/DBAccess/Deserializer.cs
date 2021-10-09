namespace SnippetVault {

public class EventInfo {
    [MySqlColName("ID")]
    public int EventID { get; set; }

    //Notice there is no attribute on this property? 
    public string Name { get; set; }

    [MySqlColName("State")]
    public string State { get; set; }

    [MySqlColName("Start_Date")]
    public DateTime StartDate { get; set; }

    [MySqlColName("End_Date")]
    public DateTime EndDate { get; set; }

    public static List<T> ToList<T>(this DataTable table) where T : class, new() {
        try {
            List<T> list = new List<T>();

            foreach (var row in table.AsEnumerable()) {
                T obj = new T();

                foreach (var prop in obj.GetType().GetProperties()) {
                    try {
                        string ColumnName = prop.Name;

                        object[] attrs = prop.GetCustomAttributes(true);
                        foreach (object attr in attrs) {
                            if (attr is MySqlColName colName) {
                                if (!colName.Name.IsNullOrWhiteSpace()) ColumnName = colName.Name;
                            }
                        }

                        PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);

                        //GET THE COLUMN NAME OFF THE ATTRIBUTE OR THE NAME OF THE PROPERTY
                        propertyInfo.SetValue(obj, Convert.ChangeType(row[ColumnName], propertyInfo.PropertyType), null);
                    } catch {
                        continue;
                    }
                }
                list.Add(obj);
            }
            return list;
        } catch {
            return null;
        }
    }
}


[AttributeUsage(AttributeTargets.Property, Inherited = false)]
public class MySqlColName : Attribute {
    private string _name = "";
    public string Name { get => _name; set => _name = value; }

    public MySqlColName(string name) {
        _name = name;
    }
}


}