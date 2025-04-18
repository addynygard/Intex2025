using System.Security.Claims;
using Intex2025.API.Data;
using Intex2025.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RootkitAuth.API.Data;
using Intex2025.API.Models.Auth;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);


// === DATABASES ===
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// === SERVICES ===
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalFrontend",
        policy => policy
            .WithOrigins(
                "http://localhost:5173",
                "https://mango-forest-0265fa21e.6.azurestaticapps.net",

                "https://recommendation-api-intex2025-bvhebjanhyfbeafy.eastus-01.azurewebsites.net",
                "https://intex2025-group3-5-2nd-backend-ehfjgfbkgpddatfk.eastus-01.azurewebsites.net"

            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// === IDENTITY ===
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
    options.Password.RequiredUniqueChars = 5;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// === CUSTOM SERVICES ===
builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddHttpClient<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<TMovieRatingOperations>();

var app = builder.Build();


// === INITIAL ROLE & USER SETUP ===
using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
//     var userManager = services.GetRequiredService<UserManager<IdentityUser>>();

//     string[] roles = new[] { "Admin", "User" };

//     foreach (var role in roles)
//     {
//         if (!await roleManager.RoleExistsAsync(role))
//         {
//             await roleManager.CreateAsync(new IdentityRole(role));
//             Console.WriteLine($"✅ Created role: {role}");
//         }
//     }

//     // ✅ Seed a default test user
//     var testEmail = "test@test.com";
//     var testPassword = "P@ssword123!";
//     var testUser = await userManager.FindByEmailAsync(testEmail);

//     if (testUser == null)
//     {
//         var newUser = new IdentityUser
//         {
//             UserName = testEmail,
//             Email = testEmail,
//             EmailConfirmed = true
//         };

//         var createResult = await userManager.CreateAsync(newUser, testPassword);

//         if (createResult.Succeeded)
//         {
//             await userManager.AddToRoleAsync(newUser, "User");
//             Console.WriteLine($"✅ Seeded user: {testEmail} with password: {testPassword}");
//         }
//         else
//         {
//             Console.WriteLine("❌ Failed to seed test user:");
//             foreach (var error in createResult.Errors)
//                 Console.WriteLine($"   - {error.Description}");
//         }
//     }
//     else
//     {
//         Console.WriteLine("ℹ️ Test user already exists.");
//     }
//         // ✅ Promote test user to Admin if not already
//     testUser ??= await userManager.FindByEmailAsync(testEmail);

//     if (testUser != null && !await userManager.IsInRoleAsync(testUser, "Admin"))
//     {
//         await userManager.AddToRoleAsync(testUser, "Admin");
//         Console.WriteLine("👑 test@test.com promoted to Admin!");
//     }

// }

// === MIDDLEWARE ===


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHsts();
app.UseHttpsRedirection();
app.UseRouting();
Console.WriteLine("✅ CORS policy is being applied");

app.UseHttpsRedirection();

// ✅ Add CSP header middleware here
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com https://accounts.google.com; " +
        "img-src 'self' https://ashleestreamimages.blob.core.windows.net data:; " +
        "connect-src 'self' https://localhost:5000 http://localhost:8000 https://accounts.google.com https://oauth2.googleapis.com; https://mango-forest-0265fa21e.6.azurestaticapps.net https://intex2025-group3-5-2nd-backend-ehfjgfbkgpddatfk.eastus-01.azurewebsites.net https://mission13-bingham-backend-ezh2cwdwg6e4cgct.eastus-01.azurewebsites.net" +
        "font-src 'self' fonts.gstatic.com data:; " +
        "frame-src 'self' https://accounts.google.com https://oauth2.googleapis.com; " +
        "frame-ancestors 'none'; " +
        "object-src 'none'; " +
        "form-action 'self'; " +
        "base-uri 'self';"
    );
    await next();
});
app.UseRouting();


app.UseCors("AllowLocalFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// app.MapIdentityApi<IdentityUser>();

// === LOGIN ===
app.MapPost("/login", async (
    SignInManager<IdentityUser> signInManager,
    UserManager<IdentityUser> userManager,
    HttpContext context,
    [FromBody] LoginRequest login
) =>
{
    Console.WriteLine("📥 Login endpoint hit");
    Console.WriteLine($"📧 Email: {login.Email}, 🔑 Password: {login.Password}");

    var user = await userManager.FindByEmailAsync(login.Email);
    if (user == null)
    {
        Console.WriteLine("❌ User not found for email: " + login.Email);
        return Results.Unauthorized();
    }

    var result = await signInManager.PasswordSignInAsync(user, login.Password, false, false);
    if (!result.Succeeded)
    {
        Console.WriteLine("❌ Invalid password for user: " + login.Email);
        return Results.Unauthorized();
    }

    if (user.Email == "admin@example.com" && !await userManager.IsInRoleAsync(user, "Admin"))
    {
        await userManager.AddToRoleAsync(user, "Admin");
    }
    else if (!await userManager.IsInRoleAsync(user, "User"))
    {
        await userManager.AddToRoleAsync(user, "User");
    }

    var roles = await userManager.GetRolesAsync(user);
    if (roles.Count == 0)
        Console.WriteLine($"⚠️  {user.Email} has NO roles assigned!");
    else
        Console.WriteLine($"✅ {user.Email} has roles: {string.Join(", ", roles)}");

    return Results.Ok(new { message = "Login successful", email = user.Email, roles = roles });
});

// === LOGOUT ===
app.MapPost("/logout", async (
    HttpContext context,
    SignInManager<IdentityUser> signInManager
) =>
{
    await signInManager.SignOutAsync();

    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

// === AUTH CHECK ===
app.MapGet("/pingauth", async (
    HttpContext context,
    UserManager<IdentityUser> userManager
) =>
{
    var userPrincipal = context.User;
    if (!userPrincipal.Identity?.IsAuthenticated ?? true)
    {
        Console.WriteLine("Unauthorized request to /pingauth");
        return Results.Unauthorized();
    }

    var email = userPrincipal.FindFirstValue(ClaimTypes.Email);
    var user = await userManager.FindByEmailAsync(email ?? "");

    if (user == null)
        return Results.Unauthorized();

    var roles = await userManager.GetRolesAsync(user);
    Console.WriteLine($"Authenticated User: {email} with roles: {string.Join(", ", roles)}");

    return Results.Json(new
    {
        email = email,
        userId = user.Id, // ✅ Add this
        roles = roles     // ✅ Use "roles", not "role"
    });
}).RequireAuthorization();



app.MapPost("/createAccount", async (
    UserManager<IdentityUser> userManager,
    [FromBody] RegisterRequest register
) =>
{
    var newUser = new IdentityUser
    {
        UserName = register.Email,
        Email = register.Email,
        EmailConfirmed = true
    };

    var result = await userManager.CreateAsync(newUser, register.Password);

    if (!result.Succeeded)
    {
        Console.WriteLine("❌ Failed to create account:");
        foreach (var error in result.Errors)
            Console.WriteLine($"   - {error.Description}");
        return Results.BadRequest(result.Errors);
    }

    // ✅ Automatically add to "User" role
    await userManager.AddToRoleAsync(newUser, "User");
    Console.WriteLine($"✅ Created new user {register.Email} and assigned 'User' role");

    return Results.Ok(new { message = "Account created successfully" });
});


app.Run();
