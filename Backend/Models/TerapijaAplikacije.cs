using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class TerapijaAplikacije
{
    [Key]
    public int IdAplikacije { get; set; }                

    [ForeignKey("Terapija")]
    public int IdTerapije { get; set; }                  
    public Terapija Terapija { get; set; } = null!;

    public DateTime DatumVrijeme { get; set; }            

    public decimal PrimijenjenaKolicina { get; set; }     

    [ForeignKey("Korisnik")]
    public int IdIzvrsilac { get; set; }                  
    public Korisnik Izvrsilac { get; set; } = null!;      

    public string Napomena { get; set; } = null!;         
}
