#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.components;

import com.webforj.Page;
import com.webforj.component.Composite;
import com.webforj.component.button.Button;
import com.webforj.component.button.ButtonTheme;
import com.webforj.component.html.elements.H3;
import com.webforj.component.icons.Icon;
import com.webforj.component.icons.TablerIcon;
import com.webforj.component.layout.flexlayout.FlexAlignment;
import com.webforj.component.layout.flexlayout.FlexDirection;
import com.webforj.component.layout.flexlayout.FlexLayout;

public class Explore extends Composite<FlexLayout> {
  private static final String DOCS_URL = "https://docs.webforj.com/docs/components/overview";

  private FlexLayout self = getBoundComponent();

  public Explore() {
    self.addClassName("explore-component");
    self.setStyle("margin", "1em auto");
    self.setStyle("text-align", "center");
    self.setDirection(FlexDirection.COLUMN);
    self.setAlignment(FlexAlignment.CENTER);
    self.setMaxWidth(400);
    self.setSpacing(".75em");

    Icon icon = TablerIcon.create("sparkles");
    icon.setStyle("font-size", "3rem");

    FlexLayout badge = FlexLayout.create(icon).align().center().justify().center().build();
    badge.setStyle("width", "6rem");
    badge.setStyle("height", "6rem");
    badge.setStyle("border-radius", "50%");
    badge.setStyle("background", "var(--dwc-color-primary-alt)");
    badge.setStyle("color", "var(--dwc-color-on-primary-text-alt)");

    Button cta = new Button("Explore components")
        .setSuffixComponent(TablerIcon.create("arrow-narrow-right"))
        .setTheme(ButtonTheme.PRIMARY);
    cta.onClick(ev -> Page.getCurrent().open(DOCS_URL, "_blank"));

    self.add(badge, new H3("Ready to create an awesome UI?"), cta);
  }
}
