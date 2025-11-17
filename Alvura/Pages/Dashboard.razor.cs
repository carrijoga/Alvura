using Microsoft.AspNetCore.Components;
using MudBlazor;

namespace Alvura.Pages;

public class DashboardBase : ComponentBase
{
    protected List<BreadcrumbItem> _items =
    [
        new("Dashboard", href: "/"),
        new("Visão Geral", href: "#"),
    ];
}
