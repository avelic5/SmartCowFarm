using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Muza
{
    [Key]
    public int IdMuze { get; set; }

    [ForeignKey("Krava")]
    public int IdKrave { get; set; }
    public Krava Krava { get; set; } = null!;

    public DateOnly Datum { get; set; }

    public TimeOnly VrijemePocetka { get; set; }
    public TimeOnly VrijemeZavrsretka { get; set; }

    public decimal KolicinaLitara { get; set; }
    public decimal ProsjecanProtokLMin { get; set; }
    public decimal TemperaturaMlijeka { get; set; }

    public string NacinUnosa { get; set; } = null!;
    public string OznakaOdstupanja { get; set; } = null!;

    public string Napomena { get; set; } = null!;
}
