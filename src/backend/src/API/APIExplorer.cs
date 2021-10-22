namespace SnippetVault {
using Microsoft.AspNetCore.Mvc.ApplicationModels;


public class APIExplorer : IApplicationModelConvention {
    public void Apply(ApplicationModel application) {
        foreach (var controller in application.Controllers) {
            if (controller.ApiExplorer.IsVisible == null) {
                controller.ApiExplorer.IsVisible = true;
                controller.ApiExplorer.GroupName = controller.ControllerName;
            }
        }
    }
}

}