// Variables
const SENTENCES_NUM = 560
var data_en;
var data_ja;
var hint;
var hint_num;
var hint_str;
var question_ja_text;

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] =[array[j], array[i]];
  }
  return array;
}

// num
var num = Number(localStorage.getItem('num'));
var num_list = JSON.parse(localStorage.getItem('num_list'));
if (!num || !num_list) {
  resetNum();
  resetNumlist();
}

$(function () {
  $.ajax({
    url:'./data/en_list.txt',
    success: function(data){
      data_en = data.split(/\r\n|\r|\n/);
    }
  });
  $.ajax({
    url:'./data/ja_list.txt',
    success: function(data){
      data_ja = data.split(/\r\n|\r|\n/);
    }
  });
});

$('html').css({
  overflow: 'hidden'
});
document.addEventListener(
  'touchmove',
  scrollControll,
  {
    passive: false
  }
);
var scrollControll = function(event) {
  if ($(event.target).closest('.js-can-scroll').length > 0) {
    event.stopPropagation();
  } else {
    event.preventDefault();
  }
};

// TOP to QUESTION
$('#top_start').click(function() {
  resetNum();
  resetNumlist();
  transition('#top', '#question');
  showQuestion();
});
$('#top_continue').click(function() {
  transition('#top', '#question');
  showQuestion();
});

// QUESTION to TOP
$('#question_top').click(function() {
  transition('#question', '#top');
});
// QUESTION's HINT
$('#question_hint').click(function() {
  hint_num++;
  hint_str = '';
  for (let i = 0; i < hint_num && i < hint.length; i++) {
    hint_str = hint_str + ' ' + hint[i];
  }
  $('#question_en').text(hint_str);
});
// QUESTION to ANSWER
$('#question_answer').click(function() {
  transition('#question', '#answer');
  showAnswer();
});

// ANSWER to TOP
$('#answer_top').click(function() {
  transition('#answer', '#top');
});
// ANSWER to QUESTION
$('#answer_question').click(function() {
  addNum();
  if (num == SENTENCES_NUM) {
    // ANSWER to FINISH
    transition('#answer', '#finish');
  } else {
    transition('#answer', '#question');
    showQuestion();
  }
});
// FINISH to TOP
$('#finish_top').click(function() {
  transition('#answer', '#top');
  resetNum();
});


function transition(from, to){
  $(from).css({
    'display': 'none'
  });
  $(to).css({
    'display': 'block'
  });
}

function showQuestion() {
  $('#question_ja').text('(' + String(num+1) + ').' + data_ja[num_list[num]]);
  $('#question_en').text('');
  hint = data_en[num_list[num]].split(' ');
  hint_num = 0;
}

function showAnswer() {
  $('#answer_ja').text('(' + String(num+1) + ').' + data_ja[num_list[num]]);
  $('#answer_en').text(data_en[num_list[num]] + ' (' + String(num_list[num] + 1) + ')');
}


function resetNum(){
  num = 0;
  localStorage.setItem('num', num);
}
function resetNumlist() {
  num_list = shuffle([...Array(SENTENCES_NUM).keys()]);
  localStorage.setItem('num_list', JSON.stringify(num_list));
}

function addNum() {
  num++;
  localStorage.setItem('num', num);
}