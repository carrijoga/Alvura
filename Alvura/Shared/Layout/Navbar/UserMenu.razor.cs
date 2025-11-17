using Microsoft.AspNetCore.Components;
using MudBlazor;

namespace Alvura.Shared.Layout.Navbar;

public class UserMenuBase : ComponentBase
{
    #region Inject

    [Inject] protected NavigationManager Navigation { get; set; }

    #endregion

    #region Parameter

    [Parameter] public EventCallback OnToggleDarkMode { get; set; }

    #endregion

    #region Properties

    protected string DarkModeIcon = Icons.Material.Outlined.DarkMode;
    protected string DarkModeTooltip = "Dark Mode";
    protected bool useAvatarIcon = false;

    #endregion

    #region Methods

    protected async Task ToggleDarkMode()
    {
        var isDarkMode = DarkModeIcon == Icons.Material.Outlined.DarkMode;
        DarkModeIcon = isDarkMode ? Icons.Material.Outlined.LightMode : Icons.Material.Outlined.DarkMode;
        DarkModeTooltip = isDarkMode ? "Light Mode" : "Dark Mode";

        if (OnToggleDarkMode.HasDelegate)
            await OnToggleDarkMode.InvokeAsync(null);
    }

    protected void Logout() =>
        Navigation.NavigateTo("/logout");

    protected void RedirectRoute(string route) =>
        Navigation.NavigateTo(route);

    #endregion
}
