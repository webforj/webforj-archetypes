#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package};

import com.webforj.App;
import com.webforj.annotation.AppProfile;
import com.webforj.annotation.AppTheme;
import com.webforj.annotation.Routify;
import com.webforj.annotation.StyleSheet;

@Routify(packages = "${package}.views")
@StyleSheet("ws://app.css")
@AppTheme("system")
@AppProfile(name = "${appName}", shortName = "${appName}")
public class Application extends App {
}
