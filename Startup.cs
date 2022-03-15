using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;

namespace Next_Core_Blog
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddCors(options => {
                options.AddPolicy("Dev", builder => {
                    builder.WithMethods("GET","POST","PATCH","DELETE")
                    .AllowCredentials()
                    .SetIsOriginAllowed(origin => {
                        if(string.IsNullOrWhiteSpace(origin)) return false;
                        if(origin.ToLower().StartsWith("http://localhost")) return true;
                        return false;
                    });
                });
            });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>{
                options.Cookie.Name = "UserLoginCookie";
                options.SlidingExpiration = true;
                options.ExpireTimeSpan = new TimeSpan(1,0,0);
                options.Events.OnRedirectToLogin = (context) =>{
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.None;
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Next_Core_Blog", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Next_Core_Blog v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            // necessary Setting 
            app.UseCors("Dev");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
