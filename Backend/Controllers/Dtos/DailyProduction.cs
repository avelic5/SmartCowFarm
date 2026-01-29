using System;

namespace Backend.Controllers.Dtos;

public class DailyProduction
{
    public DateOnly Datum { get; set; }
    public decimal Kolicina { get; set; }
    public decimal ProsjekProtoka { get; set; }
}
