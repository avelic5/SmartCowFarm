using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Enums;

namespace Backend.Models;

public class OcitanjeSenzora
{
    [Key]
    public int IdOcitanja { get; set; }                   

    [ForeignKey("Senzor")]
    public int IdSenzora { get; set; }                     
    public Senzor Senzor { get; set; } = null!;

    public DateTime Timestamp { get; set; }                

    public decimal Vrijednost { get; set; }                

    public StatusOcitavanja StatusOcitanja { get; set; }     

    public string Napomena { get; set; } = null!;          
    [ForeignKey("Korisnik")]
    public int? IdOsobeReagovala { get; set; }              
}
