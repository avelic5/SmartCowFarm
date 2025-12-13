using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Enums;

namespace Backend.Models;

public class Upozorenje
{
    [Key]
    public int IdUpozorenja { get; set; }              
    public TipUpozorenja TipUpozorenja { get; set; } 
    public NivoUpozorenja NivoUpozorenja { get; set; }          
    public string Opis { get; set; } = null!;         
    public string RazlogAktiviranja { get; set; } = null!;

    public DateTime VrijemeDetekcije { get; set; } 

    [ForeignKey("Krava")]
    public int? IdKrave { get; set; } 
    public Krava Krava { get; set; }  =null!;    

    [ForeignKey("Senzor")]          
    public int? IdSenzora { get; set; }   
    public Senzor Senzor { get; set; }=null!;

    [ForeignKey("Zadatak")]            
    public int? IdZadatka { get; set; } 
    public Zadatak Zadatak { get; set; }=null!;              

    public string KanaliSlani { get; set; } = null!;  
    public DateTime? VrijemePrveReakcije { get; set; } 

    public int? IdOsobaPreuzela { get; set; }          

    public StatusUpozorenja StatusUpozorenja { get; set; }  
    public string Napomena { get; set; } = null!;     
}
