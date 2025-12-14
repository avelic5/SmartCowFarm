using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Terapija
{
    [Key]
    public int IdTerapije { get; set; }
    public int IdSlucaja { get; set; }
    public ZdravstveniSlucaj ZdravstveniSlucaj { get; set; } = null!; //opcionalno
    public string NazivLijeka { get; set; } = null!;
    public decimal Doza { get; set; }
    public string JedinicaMjere { get; set; } = null!;
    public int TrajanjeDana { get; set; }
    public string Ucestalost { get; set; } = null!;
    public DateOnly DatumPocetka { get; set; }
    public DateOnly DatumKraja { get; set; }
    public string Uputstvo { get; set; } = null!;
    public string Napomena { get; set; } = null!;
}
