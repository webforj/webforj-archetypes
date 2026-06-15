#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package};

#if( ${flavor} == "webforj-spring" )
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
#end
import com.webforj.App;
import com.webforj.annotation.AppProfile;
import com.webforj.annotation.AppTheme;
import com.webforj.annotation.Routify;
import com.webforj.bundle.annotation.BundleEntry;

#if( ${flavor} == "webforj-spring" )
@SpringBootApplication
#end
@Routify(packages = "${package}.views")
@BundleEntry("app.css")
@AppTheme("system")
@AppProfile(name = "${appName}", shortName = "${appName}")
public class Application extends App {
#if( ${flavor} == "webforj-spring" )

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
#end
}
