using System;
using System.ComponentModel.DataAnnotations;
using Backend.Models.Enums;

namespace Backend.Models;

public class Senzor
{
    [Key]
    public int IdSenzora { get; set; }                 

    public TipSenzora TipSenzora { get; set; }     
    public string JedinicaMjere { get; set; } = null!; 
    public string Naziv { get; set; } = null!;         

    public string Opis { get; set; } = null!;          

    public decimal PragNormalnoMin { get; set; }       
    public decimal PragNormalnoMax { get; set; }       
    public decimal PragCriticalMin { get; set; }       
    public decimal PragCriticalMax { get; set; }       

    public DateOnly DatumKalibracije { get; set; }     

    public StatusOcitavanja Status { get; set; } 
}
