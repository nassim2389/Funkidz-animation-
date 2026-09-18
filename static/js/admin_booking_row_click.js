(function () {
    function isInteractive(el) {
        return el.closest('a, input, select, option, textarea, button, label');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var rows = document.querySelectorAll('#result_list tbody tr');
        rows.forEach(function (row) {
            var link = row.querySelector('a');
            if (!link) return;

            row.style.cursor = 'pointer';
            row.addEventListener('click', function (event) {
                if (isInteractive(event.target)) return;
                window.location.href = link.href;
            });
        });
    });
})();
