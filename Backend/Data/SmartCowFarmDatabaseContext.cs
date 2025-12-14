using System;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class SmartCowFarmDatabaseContext : DbContext
{
    public SmartCowFarmDatabaseContext(DbContextOptions<SmartCowFarmDatabaseContext> options) : base(options)
    { }
    public DbSet<Korisnik> Korisnici { get; set; }
    public DbSet<Krava> Krave { get; set; }
    public DbSet<Muza> Muze { get; set; }
    public DbSet<OcitanjeSenzora> OcitanjaSenzora { get; set; }
    public DbSet<Senzor> Senzori { get; set; }
    public DbSet<Terapija> Terapije { get; set; }
    public DbSet<TerapijaAplikacije> TerapijeAplikacije { get; set; }
    public DbSet<Upozorenje> Upozorenja { get; set; }
    public DbSet<Zadatak> Zadaci { get; set; }
    public DbSet<ZdravstveniSlucaj> ZdravstveniSlucajevi { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Krava>(entity =>
        {
            entity.Property(e => e.PocetnaTezina)
                .HasPrecision(10, 2);

            entity.Property(e => e.ProsjecnaDnevnaProizvodnjaL)
                .HasPrecision(10, 2);

            entity.Property(e => e.TrenutnaProcijenjenaTezina)
                .HasPrecision(10, 2);
        });

        modelBuilder.Entity<Muza>(entity =>
        {
            entity.Property(e => e.KolicinaLitara)
                .HasPrecision(10, 2);

            entity.Property(e => e.ProsjecanProtokLMin)
                .HasPrecision(10, 2);

            entity.Property(e => e.TemperaturaMlijeka)
                .HasPrecision(5, 2);
        });

        modelBuilder.Entity<OcitanjeSenzora>(entity =>
        {
            entity.Property(e => e.Vrijednost)
                .HasPrecision(10, 3);
        });

        modelBuilder.Entity<Senzor>(entity =>
        {
            entity.Property(e => e.PragCriticalMax)
                .HasPrecision(10, 3);

            entity.Property(e => e.PragCriticalMin)
                .HasPrecision(10, 3);

            entity.Property(e => e.PragNormalnoMax)
                .HasPrecision(10, 3);

            entity.Property(e => e.PragNormalnoMin)
                .HasPrecision(10, 3);
        });

        modelBuilder.Entity<Terapija>(entity =>
        {
            entity.Property(e => e.Doza)
                .HasPrecision(10, 2);
        });


        modelBuilder.Entity<TerapijaAplikacije>(entity =>
        {
            entity.Property(e => e.PrimijenjenaKolicina)
                .HasPrecision(10, 2);
        });


        modelBuilder.Entity<Zadatak>(entity =>
        {
            entity.Property(e => e.StatusZadatka)
                .HasConversion<string>();

            entity.Property(e => e.Prioritet)
                .HasConversion<string>();

            entity.Property(e => e.TipZadatka)
                .HasConversion<string>();
        });

        modelBuilder.Entity<Upozorenje>(entity =>
        {
            entity.Property(e => e.StatusUpozorenja)
                .HasConversion<string>();

            entity.Property(e => e.NivoUpozorenja)
                .HasConversion<string>();

            entity.Property(e => e.TipUpozorenja)
                .HasConversion<string>();
        });

        modelBuilder.Entity<OcitanjeSenzora>(entity =>
        {
            entity.Property(e => e.StatusOcitanja)
                .HasConversion<string>();
        });

        modelBuilder.Entity<ZdravstveniSlucaj>(entity =>
        {
            entity.Property(e => e.StatusSlucaja)
                .HasConversion<string>();
        });

        modelBuilder.Entity<Korisnik>(entity =>
        {
            entity.Property(e => e.RadnoMjesto)
                .HasConversion<string>();

            entity.Property(e => e.Odjel)
                .HasConversion<string>();

            entity.Property(e => e.StatusNaloga)
                .HasConversion<string>();
        });

        modelBuilder.Entity<Senzor>(entity =>
        {
            entity.Property(e => e.TipSenzora)
                .HasConversion<string>();
        });
    }
}
