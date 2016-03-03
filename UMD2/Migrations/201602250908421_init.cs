namespace UMD2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Contributors",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Roles = c.String(),
                        Surname = c.String(),
                        GivenName = c.String(),
                        DoB = c.DateTime(nullable: false),
                        Nationality = c.String(),
                        WebsiteUrl = c.String(),
                        ProfileUrl = c.String(),
                        Description = c.String(),
                        CurrentAffiliation = c.String(),
                        PastAffiliations = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Comments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Contributor_Id = c.Int(),
                        Review_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Contributors", t => t.Contributor_Id)
                .ForeignKey("dbo.Reviews", t => t.Review_Id)
                .Index(t => t.Contributor_Id)
                .Index(t => t.Review_Id);
            
            CreateTable(
                "dbo.Media",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Type = c.String(),
                        IsActive = c.Boolean(nullable: false),
                        IsPublic = c.Boolean(nullable: false),
                        DbDateAdded = c.DateTime(nullable: false),
                        Title = c.String(),
                        ReleaseDate = c.DateTime(nullable: false),
                        Description = c.String(),
                        ContentRating = c.String(),
                        CountryOfOrigin = c.String(),
                        ThumbnailUrl = c.String(),
                        Genre = c.String(),
                        AverageRating = c.Single(nullable: false),
                        RatingCount = c.Int(nullable: false),
                        Language = c.String(),
                        AveragePlaytime = c.Int(),
                        Platforms = c.String(),
                        Engine = c.String(),
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Playtime = c.Int(),
                        Duration = c.Int(),
                        IsAnimation = c.Boolean(),
                        Language1 = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Collections",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Reviews",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OwnerId = c.String(),
                        OwnerName = c.String(),
                        MediaId = c.Int(nullable: false),
                        Score = c.Int(nullable: false),
                        Content = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Media", t => t.MediaId, cascadeDelete: true)
                .Index(t => t.MediaId);
            
            CreateTable(
                "dbo.UserMedias",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OwnerId = c.String(),
                        MediaId = c.Int(nullable: false),
                        Rating = c.Int(nullable: false),
                        Status = c.String(),
                        WatchTime = c.Int(nullable: false),
                        AddedToList = c.DateTime(nullable: false),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        Tags = c.String(),
                        ReValue = c.Int(nullable: false),
                        ReCount = c.Int(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Media", t => t.MediaId, cascadeDelete: true)
                .Index(t => t.MediaId);
            
            CreateTable(
                "dbo.Publishers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Game_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Media", t => t.Game_Id)
                .Index(t => t.Game_Id);
            
            CreateTable(
                "dbo.Studios",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Game_Id = c.Int(),
                        Movie_Id = c.Int(),
                        Contributor_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Media", t => t.Game_Id)
                .ForeignKey("dbo.Media", t => t.Movie_Id)
                .ForeignKey("dbo.Contributors", t => t.Contributor_Id)
                .Index(t => t.Game_Id)
                .Index(t => t.Movie_Id)
                .Index(t => t.Contributor_Id);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.CollectionMedias",
                c => new
                    {
                        Collection_Id = c.Int(nullable: false),
                        Media_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Collection_Id, t.Media_Id })
                .ForeignKey("dbo.Collections", t => t.Collection_Id, cascadeDelete: true)
                .ForeignKey("dbo.Media", t => t.Media_Id, cascadeDelete: true)
                .Index(t => t.Collection_Id)
                .Index(t => t.Media_Id);
            
            CreateTable(
                "dbo.MediaContributors",
                c => new
                    {
                        Media_Id = c.Int(nullable: false),
                        Contributor_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Media_Id, t.Contributor_Id })
                .ForeignKey("dbo.Media", t => t.Media_Id, cascadeDelete: true)
                .ForeignKey("dbo.Contributors", t => t.Contributor_Id, cascadeDelete: true)
                .Index(t => t.Media_Id)
                .Index(t => t.Contributor_Id);
            
            CreateTable(
                "dbo.ApplicationUserMedias",
                c => new
                    {
                        ApplicationUser_Id = c.String(nullable: false, maxLength: 128),
                        Media_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ApplicationUser_Id, t.Media_Id })
                .ForeignKey("dbo.AspNetUsers", t => t.ApplicationUser_Id, cascadeDelete: true)
                .ForeignKey("dbo.Media", t => t.Media_Id, cascadeDelete: true)
                .Index(t => t.ApplicationUser_Id)
                .Index(t => t.Media_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.Studios", "Contributor_Id", "dbo.Contributors");
            DropForeignKey("dbo.Studios", "Movie_Id", "dbo.Media");
            DropForeignKey("dbo.Studios", "Game_Id", "dbo.Media");
            DropForeignKey("dbo.Publishers", "Game_Id", "dbo.Media");
            DropForeignKey("dbo.UserMedias", "MediaId", "dbo.Media");
            DropForeignKey("dbo.Reviews", "MediaId", "dbo.Media");
            DropForeignKey("dbo.Comments", "Review_Id", "dbo.Reviews");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.ApplicationUserMedias", "Media_Id", "dbo.Media");
            DropForeignKey("dbo.ApplicationUserMedias", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.MediaContributors", "Contributor_Id", "dbo.Contributors");
            DropForeignKey("dbo.MediaContributors", "Media_Id", "dbo.Media");
            DropForeignKey("dbo.CollectionMedias", "Media_Id", "dbo.Media");
            DropForeignKey("dbo.CollectionMedias", "Collection_Id", "dbo.Collections");
            DropForeignKey("dbo.Comments", "Contributor_Id", "dbo.Contributors");
            DropIndex("dbo.ApplicationUserMedias", new[] { "Media_Id" });
            DropIndex("dbo.ApplicationUserMedias", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.MediaContributors", new[] { "Contributor_Id" });
            DropIndex("dbo.MediaContributors", new[] { "Media_Id" });
            DropIndex("dbo.CollectionMedias", new[] { "Media_Id" });
            DropIndex("dbo.CollectionMedias", new[] { "Collection_Id" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.Studios", new[] { "Contributor_Id" });
            DropIndex("dbo.Studios", new[] { "Movie_Id" });
            DropIndex("dbo.Studios", new[] { "Game_Id" });
            DropIndex("dbo.Publishers", new[] { "Game_Id" });
            DropIndex("dbo.UserMedias", new[] { "MediaId" });
            DropIndex("dbo.Reviews", new[] { "MediaId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.Comments", new[] { "Review_Id" });
            DropIndex("dbo.Comments", new[] { "Contributor_Id" });
            DropTable("dbo.ApplicationUserMedias");
            DropTable("dbo.MediaContributors");
            DropTable("dbo.CollectionMedias");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.Studios");
            DropTable("dbo.Publishers");
            DropTable("dbo.UserMedias");
            DropTable("dbo.Reviews");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Collections");
            DropTable("dbo.Media");
            DropTable("dbo.Comments");
            DropTable("dbo.Contributors");
        }
    }
}
