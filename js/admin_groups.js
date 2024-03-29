(function($) {
  $(document).ready(function() {
    //Make memberships sortable
    $(function() {
      $('#sortable-products').sortable();
    });
    function sync_fallback_available_products() {
      var option;
      var available_products = $('#sortable-products select[name="_mepr_products[product][]"] :selected');
      var fallback_select = $('select[name="_mepr_fallback_membership"]');
      var selected_fallback = $(':selected', fallback_select).first().val();

      //Remove all options except the default
      $('option:gt(0)', fallback_select).remove();
      //Add the available product options
      available_products.each(function() {
        option = $("<option></option>")
          .attr("value", this.value)
          .text(this.text);
        //Set the selected value
        if(selected_fallback === this.value) {
          option.attr('selected', 'selected');
        }
        fallback_select.append(option);
      });

      return false;
    }
    function show_readylaunch_limit() {
      // Baily early if RL isn't enabled for pricing page.
      if(!MeprAdminGroups.readylaunch_enabled) {
        return;
      }

      var count = $('ol#sortable-products li').length;

      if(count > 5){
        $('#readylaunch-group-limit').show()
        // $("#readylaunch-group-limit").insertAfter("body");
        // $('#readylaunch-group-limit').show()
      } else{
        $('#readylaunch-group-limit').hide()
      }
    }
    show_readylaunch_limit();

    //Add new membership li
    $('a#add-new-product').click(function() {
      if($('ol#sortable-products li').length >= 5){show_readylaunch_limit()}
      $('ol#sortable-products').append($('div#hidden-line-item').html());
      sync_fallback_available_products();
      show_readylaunch_limit();
      return false;
    });
    //Remove a membership li
    $('body').on('click', 'a.remove-product-item', function() {
      $(this).parent().parent().remove();
      sync_fallback_available_products();
      show_readylaunch_limit();
      return false;
    });
    //Alert if membership already is assigned to another group
    $('body').on('change', 'select.group_products_dropdown', function() {
      var data = {
        action: 'mepr_is_product_already_in_group',
        product_id: $(this).val()
      };
      $.post(ajaxurl, data, function(response) {
        if(response != '') {
          alert(response); //Alerts the user to the fact that this Membership is already in a group
        }
      });
      sync_fallback_available_products();
    });

    //Change mouse pointer over li items
    $('body').on('mouseenter', '.mepr-sortable li', function() {
      $(this).addClass('mepr-hover');
    });
    $('body').on('mouseleave', '.mepr-sortable li', function() {
      $(this).removeClass('mepr-hover');
    });

    //hide pricing page theme box if Disable Pricing Page is on
    if($('#_mepr_group_pricing_page_disabled').is(":checked")) {
      $('#mepr_hidden_pricing_page_theme').hide();
    } else {
      $('#mepr_hidden_pricing_page_theme').show();
    }
    //hide alternate group url box if Disable Pricing Page is off
    if(!$('#_mepr_group_pricing_page_disabled').is(":checked")) {
      $('#mepr_hidden_alternate_group_url').hide();
    } else {
      $('#mepr_hidden_alternate_group_url').show();
    }
    $('#_mepr_group_pricing_page_disabled').click(function() {
      $('#mepr_hidden_pricing_page_theme').slideToggle('fast');
      $('#mepr_hidden_alternate_group_url').slideToggle('fast');
    });

    // Page Template Toggle
    if( $('#_mepr_use_custom_template').is(':checked') ) {
      $('#mepr-custom-page-template-select').show();
    }

    $('#_mepr_use_custom_template').click( function() {
      if($(this).is(':checked')) {
        $('#mepr-custom-page-template-select').slideDown();
      }
      else {
        $('#mepr-custom-page-template-select').slideUp();
      }
    });
  });
})(jQuery);
