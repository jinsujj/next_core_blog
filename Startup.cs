using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Next_Core_Blog.Context;
using Next_Core_Blog.Repository.BlogNote;
using Next_Core_Blog.Repository.Users;

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

            // Connect Mysql Interface as Singleton
            services.AddSingleton<DapperContext>();
            services.AddScoped<INoteRepository, NoteRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            // Controller loopHandling
            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );

            services.AddCors(options => {
                options.AddPolicy("Dev", builder => {
                    builder.WithMethods("GET","POST","PATCH","DELETE")
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(origin => {
                        if(string.IsNullOrWhiteSpace(origin)) return false;
                        if(origin.ToLower().StartsWith("http://localhost")) return true;
                        if(origin.ToLower().StartsWith("https://localhost")) return true;
                        return false;
                    });
                });
            });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>{
                options.Cookie.Name = "UserLoginCookie";
                options.SlidingExpiration = true;
                options.ExpireTimeSpan = new TimeSpan(2,0,0);  //1 hour 0 min 0 sec
                options.Events.OnRedirectToLogin = (context) =>{
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.Domain = ".owl-dev.me";
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

            /// static file dir use
            app.UseStaticFiles();

            // useCors should be located between useRouting and UseAuthorization
            app.UseCors("Dev");
            app.UseAuthentication();
            app.UseAuthorization();

            // Nginx Reverse Proxy Reliase
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
