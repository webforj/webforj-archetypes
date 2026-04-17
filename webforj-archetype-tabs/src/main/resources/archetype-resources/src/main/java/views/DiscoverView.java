#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.views;

import ${package}.components.Explore;

import com.webforj.component.Composite;
import com.webforj.component.layout.flexlayout.FlexAlignment;
import com.webforj.component.layout.flexlayout.FlexLayout;
import com.webforj.router.annotation.FrameTitle;
import com.webforj.router.annotation.Route;

@Route(value = "/discover", outlet = MainLayout.class)
@FrameTitle("Discover")
public class DiscoverView extends Composite<FlexLayout> {
  private FlexLayout self = getBoundComponent();

  public DiscoverView() {
    self.setHeight("100%");
    self.setAlignment(FlexAlignment.CENTER);
    self.add(new Explore("Nothing to discover yet", "compass", "Browse trending"));
  }
}
