﻿using System;
using System.Collections.Generic;
using Intex2025.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Intex2025.API.Data;

public partial class MovieDbContext : DbContext
{
    public MovieDbContext()
    {
    }

    public MovieDbContext(DbContextOptions<MovieDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<movies_rating> movies_ratings { get; set; }

    public virtual DbSet<movies_title> movies_titles { get; set; }

    public virtual DbSet<movies_user> movies_users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=Movies.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<movies_rating>(entity =>
        {
            // ✅ This defines the composite primary key so EF can track it
            entity.HasKey(e => new { e.user_id, e.show_id });
        });

        modelBuilder.Entity<movies_title>(entity =>
        {
            entity.HasKey(e => e.show_id);

            entity.Property(e => e.Anime_Series_International_TV_Shows).HasColumnName("Anime Series International TV Shows");
            entity.Property(e => e.British_TV_Shows_Docuseries_International_TV_Shows).HasColumnName("British TV Shows Docuseries International TV Shows");
            entity.Property(e => e.Comedies_Dramas_International_Movies).HasColumnName("Comedies Dramas International Movies");
            entity.Property(e => e.Comedies_International_Movies).HasColumnName("Comedies International Movies");
            entity.Property(e => e.Comedies_Romantic_Movies).HasColumnName("Comedies Romantic Movies");
            entity.Property(e => e.Crime_TV_Shows_Docuseries).HasColumnName("Crime TV Shows Docuseries");
            entity.Property(e => e.Documentaries_International_Movies).HasColumnName("Documentaries International Movies");
            entity.Property(e => e.Dramas_International_Movies).HasColumnName("Dramas International Movies");
            entity.Property(e => e.Dramas_Romantic_Movies).HasColumnName("Dramas Romantic Movies");
            entity.Property(e => e.Family_Movies).HasColumnName("Family Movies");
            entity.Property(e => e.Horror_Movies).HasColumnName("Horror Movies");
            entity.Property(e => e.International_Movies_Thrillers).HasColumnName("International Movies Thrillers");
            entity.Property(e => e.International_TV_Shows_Romantic_TV_Shows_TV_Dramas).HasColumnName("International TV Shows Romantic TV Shows TV Dramas");
            entity.Property(e => e.Kids__TV).HasColumnName("Kids' TV");
            entity.Property(e => e.Language_TV_Shows).HasColumnName("Language TV Shows");
            entity.Property(e => e.Nature_TV).HasColumnName("Nature TV");
            entity.Property(e => e.Reality_TV).HasColumnName("Reality TV");
            entity.Property(e => e.TV_Action).HasColumnName("TV Action");
            entity.Property(e => e.TV_Comedies).HasColumnName("TV Comedies");
            entity.Property(e => e.TV_Dramas).HasColumnName("TV Dramas");
            entity.Property(e => e.Talk_Shows_TV_Comedies).HasColumnName("Talk Shows TV Comedies");
        });

        modelBuilder.Entity<movies_user>(entity =>
        {
            entity.HasKey(e => e.user_id);

            entity.Property(e => e.user_id).ValueGeneratedNever();
            entity.Property(e => e.Amazon_Prime).HasColumnName("Amazon Prime");
            entity.Property(e => e.Apple_TV_).HasColumnName("Apple TV+");
            entity.Property(e => e.Disney_).HasColumnName("Disney+");
            entity.Property(e => e.Paramount_).HasColumnName("Paramount+");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
