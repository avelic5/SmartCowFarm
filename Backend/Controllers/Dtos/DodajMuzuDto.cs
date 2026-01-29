using System;

namespace Backend.Controllers.Dtos;

public class DodajMuzuDto
{
    public decimal KolicinaLitara { get; set; }
    public DateOnly? Datum { get; set; }
    public TimeOnly? VrijemePocetka { get; set; }
    public TimeOnly? VrijemeZavrsetka { get; set; }
    public decimal? ProsjecanProtokLMin { get; set; }
    public decimal? TemperaturaMlijeka { get; set; }
    public string? NacinUnosa { get; set; }
    public string? OznakaOdstupanja { get; set; }
    public string? Napomena { get; set; }
}
