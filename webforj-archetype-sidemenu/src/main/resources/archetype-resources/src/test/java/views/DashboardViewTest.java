#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.views;

import static org.junit.jupiter.api.Assertions.assertTrue;

import ${package}.Application;

import com.webforj.automation.find.ComponentLocator;
import com.webforj.component.html.elements.Paragraph;
import com.webforj.testbed.WebforjTestbed;
import com.webforj.testbed.annotation.WebforjTest;
import org.junit.jupiter.api.Test;

@WebforjTest(app = Application.class)
class DashboardViewTest {

  @Test
  void shouldShowTheExploreMessage(WebforjTestbed context) {
    context.navigate(DashboardView.class);

    assertTrue(ComponentLocator.of(Paragraph.class).byText("Your dashboard is empty").isPresent());
  }
}
