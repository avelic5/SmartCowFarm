using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Enums;

namespace Backend.Models;

public class Zadatak
{
    [Key]
    public int IdZadatka { get; set; }              

    public string NazivZadatka { get; set; } = null!;
    public string Opis { get; set; } = null!;        
    public Prioritet Prioritet { get; set; }    
    public TipZadatka TipZadatka { get; set; } 

    public int? IdKrave { get; set; }                
    public Krava? Krava { get; set; }

    public string Izvor { get; set; } = null!;    

    [ForeignKey("Korisnik")]
    public int IdKreator { get; set; }             
    public Korisnik Kreator { get; set; } = null!;

    [ForeignKey("Korisnik")]
    public int? IdIzvrsilac { get; set; }           
    public Korisnik? Izvrsilac { get; set; }

    public DateTime RokIzvrsenja { get; set; }        
    public DateTime? VrijemePocetka { get; set; }     
    public DateTime? VrijemeZavrsEtka { get; set; }   

    public StatusZadatka StatusZadatka { get; set; }
    public string UtroseniResursiOpis { get; set; } = null!;
    public string Napomene { get; set; } = null!;      
}
