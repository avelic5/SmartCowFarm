using System;

namespace Backend.Controllers.Dtos;

public class PromjeniStatusDto
{
    public Models.Enums.StatusZdravlja NoviStatus { get; set; }
    public string? Napomena { get; set; }
}
