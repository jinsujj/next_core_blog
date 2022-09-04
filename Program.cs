using System;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Next_Core_Blog.Context;
using Next_Core_Blog.Repository.BlogNote;
using Next_Core_Blog.Repository.Users;


var builder = WebApplication.CreateBuilder(args);

/*
*  'builder.Services' gets called by the runtime. Use this method to add services to the container.
*/
builder.Services.AddControllers();
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<INoteRepository, NoteRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Controller loop Handling
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

// Cors Setting
builder.Services.AddCors(options =>
{
    options.AddPolicy("Dev", builder =>
    {
        builder.WithMethods("GET", "POST", "PATCH", "DELETE")
        .AllowCredentials()
        .AllowAnyHeader()
        .SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;
            if (origin.ToLower().StartsWith("https://localhost")) return true;
            if (origin.ToLower().StartsWith("https://owl-dev.me")) return true;
            if (origin.ToLower().StartsWith("https://www.owl-dev.me")) return true;
            return false;
        });
    });
});

// Cookie Setting
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.Name = "UserLoginCookie";
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = new TimeSpan(6, 0, 0); // 6 hour
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.Domain =".owl-dev.me";
    });

// Swagger Generateç
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Next_Core_Blog", Version = "v1" });
});


 builder.WebHost.ConfigureKestrel((context, options) =>
  {
    options.Listen(System.Net.IPAddress.Any, 5001, listenOptions =>
    {
      // Use HTTP/3
      listenOptions.Protocols = HttpProtocols.Http1AndHttp2AndHttp3;
      listenOptions.UseHttps();
    });
  });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Next_Core_Blog v1"));
}

app.UseHttpsRedirection();
app.UseRouting();

// static file dir use wwwroot
app.UseStaticFiles();

// useCors should be located between useRouting and useAuthorization
app.UseCors("Dev");
app.UseAuthentication();
app.UseAuthorization();

// Nginx Reverse Proxy - Real Ip Set
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();