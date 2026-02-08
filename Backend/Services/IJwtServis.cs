using Backend.Models;

namespace Backend.Services
{
    public interface IJwtServis
    {
        string GenerisiToken(Korisnik korisnik);
    }
}