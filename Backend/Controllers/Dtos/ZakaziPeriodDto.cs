using System;

namespace Backend.Controllers.Dtos;

public class ZakaziPeriodDto
{
    public DateOnly NoviPocetak { get; set; }
    public DateOnly NoviKraj { get; set; }
    public string? Razlog { get; set; }
}
