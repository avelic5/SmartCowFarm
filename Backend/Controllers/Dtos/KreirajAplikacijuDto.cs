using System;

namespace Backend.Controllers.Dtos;

public class KreirajAplikacijuDto
{
    public decimal Kolicina { get; set; }
    public DateTime? DatumVrijeme { get; set; }
    public int IdIzvrsilac { get; set; }
    public string? Napomena { get; set; }
}
