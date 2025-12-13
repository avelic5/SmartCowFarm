using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Enums;

namespace Backend.Models;

public class ZdravstveniSlucaj
{
    [Key]
    public int IdSlucaja { get; set; }       
    public int IdKrave { get; set; }    
    public Krava Krava { get; set; } = null!; //opcionlano, odmah da pristupamo kravi     
    public DateOnly DatumOtvaranja { get; set; } 
    public TimeOnly VrijemeOtvaranja { get; set; }
    public string RazlogOtvaranja { get; set; } = null!;
    public string OpisSimptoma { get; set; } = null!;   
    public string AiTipAnomalije { get; set; } = null!; 
    public string AiNivoRizika { get; set; } = null!;   
    public string Dijagnoza { get; set; } = null!;      
    public StatusZdravlja StatusSlucaja { get; set; }
    [ForeignKey("Korisnik")]
    public int? IdVeterinara { get; set; }     
    public Korisnik? Veterinar { get; set; }  // opcionalno 
    public DateOnly DatumZatvaranja { get; set; }  
    public string Napomene { get; set; } = null!;  
}
