jQuery(function(){
    $('#submitButton').click(function(){
        var selectedSport = $('#sportsDropDown').val();

        $.ajax({
            type: 'POST',
            url: '/teamNames',
            data: { selectedSport: selectedSport }, 
            success: function(response){
            const dataList = $('#printNames');
            dataList.empty();
            
            const list = JSON.parse(response);
            list.forEach(item => {
                const li = $('<li>').text(item);
                dataList.append(li);
            });
        },
        error: function(error){
        console.error('Error:', error);
        }
        })
    })
});