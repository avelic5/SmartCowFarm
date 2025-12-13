using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Enums;

namespace Backend.Models;

public class Krava
{
    [Key]
    public int IdKrave { get; set; }              
    public string OznakaKrave { get; set; } = null!;    
    public string Rasa { get; set; } = null!;           

    public DateOnly DatumRodjenja { get; set; }         
    public DateOnly DatumDolaska { get; set; }          

    public string PorijekloTip { get; set; } = null!;   

    [ForeignKey("Krava")]
    public int? IdMajke { get; set; }         
    public Krava? MajkaKrava {get; set;} = null!;          

    public StatusZdravlja TrenutniStatus { get; set; } 
    public decimal PocetnaTezina { get; set; }         
    public decimal TrenutnaProcijenjenaTezina { get; set; } 

    public string OpisIzgleda { get; set; } = null!;    

    public decimal ProsjecnaDnevnaProizvodnjaL { get; set; } 

    public string Napomene { get; set; } = null!;       
}
