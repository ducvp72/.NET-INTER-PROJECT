using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using LmsBackEnd.Controllers;
using LmsBackEnd.Options;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace LmsBackEnd
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

            Global.DomainName = Configuration["DomainName"];
            Global.ConnectionString = Configuration["LmsDBstring"];


            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder => builder
                    // .WithOrigins("http://lmsfpt-group4.surge.sh")
                    .AllowCredentials()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(_ => true)
                );
            });

            services.Configure<GmailOption>(Configuration.GetSection("GmailOption"));

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "LmsBackEnd", Version = "v1" });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            services.AddScoped<ILoginInfoService, LoginInfoService>();
            services.AddScoped<IMailService, MailService>();

            services.AddDbContext<LmsContext>(opt =>
            {
                opt.UseSqlServer(Configuration.GetConnectionString("LmsDBstring"));
            });

            services.AddScoped<IRegister, RegisterAccount>();
            services.AddScoped<ICourse, Course>();
            services.AddScoped<ILesson, Lesson>();
            services.AddScoped<INotify, Notify>();
            services.AddScoped<IFeedback, Feedback>();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            // services.AddControllers().AddJsonOptions(x =>
            // x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);


            // services.AddCors(options =>
            // {
            //     options.AddDefaultPolicy(
            //         builder => builder
            //         .AllowAnyOrigin()
            //         .AllowAnyMethod()
            //         .AllowAnyHeader()
            //     );
            // });




            services.AddControllers();


            //Ph�n trang
            services.AddHttpContextAccessor();

            services.AddSingleton(X => new BlobServiceClient(Configuration.GetValue<string>("AzureBlobStorageConnectionString")));

            services.AddSingleton<IUriService>(o =>
            {
                var accessor = o.GetRequiredService<IHttpContextAccessor>();
                var request = accessor.HttpContext.Request;
                var uri = string.Concat(request.Scheme, "://", request.Host.ToUriComponent());
                return new UriService(uri);
            });


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "LmsBackEnd v1");
                    //c.DefaultModelsExpandDepth(-1);

                    // c.RoutePrefix = string.Empty;
                });
            }

            app.UseCors();
            // app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseHttpsRedirection();

            app.UseRouting();

            // global cors policy
            

            app.UseAuthorization();
            app.UseAuthentication();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
