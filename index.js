function timeAge(date) {
    const locale = {
        timeago: {
            seconds: '秒前',
            minutes: '分钟前',
            hours: '小时前',
            days: '天前',
            now: '刚刚'
        }
    }
    if (typeof date === 'number' || typeof date === 'string') date = new Date(date);
    try {
        const oldTime = date.getTime()
        const currTime = Date.now()
        const diffValue = currTime - oldTime
        const days = Math.floor(diffValue / (24 * 3600 * 1000));
        if (days === 0) {
            // 计算相差小时数
            const leave1 = diffValue % (24 * 3600 * 1000);
            const hours = Math.floor(leave1 / (3600 * 1000));
            if (hours === 0) {
                // 计算相差分钟数
                const leave2 = leave1 % (3600 * 1000);
                const minutes = Math.floor(leave2 / (60 * 1000));
                if (minutes === 0) {
                    return Math.round(leave2%60000/1000) + ` ${locale.timeago.seconds}`;
                }
                return minutes + ` ${locale.timeago.minutes}`;
            }
            return hours + ` ${locale.timeago.hours}`;
        }
        if (days < 0) return locale.timeago.now;
        function dateFormat(date) {
            function padWithZeros(vNumber, width) {
                let numAsString = vNumber.toString();
                while (numAsString.length < width) 
                    numAsString = '0' + numAsString;
                return numAsString;
            }
            const vDay = padWithZeros(date.getDate(), 2);
            const vMonth = padWithZeros(date.getMonth() + 1, 2);
            const vYear = padWithZeros(date.getFullYear(), 2);
            return `${vYear}-${vMonth}-${vDay}`
        }
        if (days < 8) return days + ` ${locale.timeago.days}`;
        else return dateFormat(date);
    } catch (error) {
        console.log('timeAgo error: ', error);
    }
}

async function getUpdateTime(user, repo) {
    let url = `https://api.github.com/repos/${user}/${repo}/commits?page=0&per_page=1`;
    try {
        let r = await fetch(url);
        if (!r.ok) {
            console.log(`Get ${user}/${repo} failed!`);
            return ;
        }
        let json = await r.json();
        let a = document.getElementById(`${user}-${repo}-update-time`);
        a.innerText = '最后更新时间：' + timeAge(json[0]['commit']['author']['date']);
    } catch (e) {
        console.log('catch ', e);
    }
}
const repos = ['blog', 'note', 'www', 'mall', 'DBLParse', 'gan']
for (let r of repos) getUpdateTime('tootal', r);
twikoo.init({
    envId: 'tootal-6g2y019v6b37e4be',
    el: '#tcomment',
    region: 'ap-guangzhou', 
    path: "'/index.html'"
})

// Register service worker to control making site work offline

if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/sw.js')
             .then(function() { console.log('Service Worker Registered'); });
}

document.getElementById('delete-cache-btn').addEventListener('click', async function(e) {
    await caches.delete('tootal-store');
    location.reload();
})