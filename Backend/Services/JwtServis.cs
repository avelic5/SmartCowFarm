using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    public class JwtServis : IJwtServis
    {
        private readonly IConfiguration _configuration;

        public JwtServis(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerisiToken(Korisnik korisnik)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "default-key-minimum-32-characters-for-security"));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, korisnik.IdKorisnika.ToString()),
                new Claim(ClaimTypes.Email, korisnik.Email),
                new Claim(ClaimTypes.Name, $"{korisnik.Ime} {korisnik.Prezime}"),
                new Claim(ClaimTypes.Role, korisnik.RadnoMjesto.ToString()),
                new Claim("KorisnickoIme", korisnik.KorisnickoIme),
                new Claim("StatusNaloga", korisnik.StatusNaloga.ToString()),
                new Claim("DatumZaposlenja", korisnik.DatumZaposlenja.ToString("yyyy-MM-dd"))
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"] ?? "1")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}